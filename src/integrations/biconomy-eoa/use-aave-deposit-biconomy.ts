import type {
  BuildApproveInstruction,
  BuildComposableInstruction,
} from '@biconomy/abstractjs';
import {
  getMeeScanLink,
  greaterThanOrEqualTo,
  runtimeERC20BalanceOf,
} from '@biconomy/abstractjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { formatUnits } from 'viem';
import { arbitrum, base } from 'viem/chains';
import { useAccount } from 'wagmi';

import { useBiconomyClient } from './use-biconomy-client';

import { getAavePoolV3Address } from '@/constants/aave';
import { COMMON_TOKENS } from '@/constants/tokens';
import {
  prepareUniswapSwapTransaction,
  useUniswap,
  type UseUniswapParams,
} from '@/hooks/use-uniswap';
import { prepareAaveSupplyCall } from '@/lib/aave';
import { getMultichainToken, getBridgeTransaction } from '@/lib/biconomy';
import { getUniswapSwapRouterAddress } from '@/lib/uniswap';

const DESTINATION_CHAIN_ID = base.id;
const SOURCE_CHAIN_ID = arbitrum.id;
const SOURCE_SWAP_TOKEN = COMMON_TOKENS[DESTINATION_CHAIN_ID]!.WETH!;

export function useAaveDepositBiconomy(
  params: Omit<UseUniswapParams, 'amount'> & { amount: bigint },
) {
  const { address } = useAccount();

  const SOURCE_TOKEN = getMultichainToken(params.fromToken);
  const DESTINATION_TOKEN = getMultichainToken(params.toToken);

  const uniswap = useUniswap({
    ...params,
    // TODO: hard targetting WETH for now
    fromToken: SOURCE_SWAP_TOKEN,
    amount: formatUnits(params.amount, params.fromToken?.decimals ?? 6),
  });
  const { orchestrator, meeClient } = useBiconomyClient();

  // Biconomy Transaction Quote
  const {
    data: fusionQuoteData,
    error: fusionQuoteError,
    ...fusionQuoteQuery
  } = useQuery({
    enabled: uniswap.isQuoteReady && Boolean(orchestrator),
    queryKey: ['uniswap', params.amount.toString()],
    queryFn: async () => {
      if (!orchestrator) {
        throw new Error('Biconomy client not found');
      }

      console.log('Preparing fusion quote', {
        amount: params.amount,
        fromToken: params.fromToken,
      });

      const amountInWei = params.amount;

      const minAfterSlippage = (amountInWei * 80n) / 100n; // 20% tolerance
      const executionConstraints = [greaterThanOrEqualTo(minAfterSlippage)];

      // Trigger
      const trigger = {
        tokenAddress: SOURCE_TOKEN.addressOn(SOURCE_CHAIN_ID),
        amount: amountInWei,
        chainId: SOURCE_CHAIN_ID,
      };

      // Intruction 1: Deposit token to Bridge
      const bridge = getBridgeTransaction({
        amount: amountInWei,
        sourceChainId: SOURCE_CHAIN_ID,
        destinationChainId: DESTINATION_CHAIN_ID,
        token: SOURCE_TOKEN,
        orchestrator,
      });

      // Intruction 2: Approve Uniswap
      const approveUniswap: BuildApproveInstruction = {
        type: 'approve',
        data: {
          amount: runtimeERC20BalanceOf({
            targetAddress: orchestrator.addressOn(
              DESTINATION_CHAIN_ID,
            ) as Address,
            tokenAddress: SOURCE_TOKEN.addressOn(DESTINATION_CHAIN_ID),
            constraints: [greaterThanOrEqualTo(1n)],
          }),
          chainId: DESTINATION_CHAIN_ID,
          spender: getUniswapSwapRouterAddress(DESTINATION_CHAIN_ID),
          tokenAddress: SOURCE_TOKEN.addressOn(DESTINATION_CHAIN_ID),
        },
      };

      // Intruction 3: Uniswap Swap
      const swap = prepareUniswapSwapTransaction({
        ...params,
        amount: runtimeERC20BalanceOf({
          targetAddress: orchestrator.addressOn(
            DESTINATION_CHAIN_ID,
          ) as Address,
          tokenAddress: SOURCE_TOKEN.addressOn(DESTINATION_CHAIN_ID),
          constraints: executionConstraints,
        }),
        recipient: orchestrator.addressOn(DESTINATION_CHAIN_ID) as Address,
        minimumReceivedWei: 0n, // TODO: get from quote - fees
      });

      const swapTx: BuildComposableInstruction = {
        type: 'default',
        data: {
          chainId: DESTINATION_CHAIN_ID,
          abi: swap.abi,
          to: swap.address,
          functionName: swap.functionName,
          args: swap.args,
        },
      };

      // Instruction 4: Approve Aave
      const approveAave: BuildApproveInstruction = {
        type: 'approve',
        data: {
          amount: runtimeERC20BalanceOf({
            targetAddress: orchestrator.addressOn(
              DESTINATION_CHAIN_ID,
            ) as Address,
            tokenAddress: DESTINATION_TOKEN.addressOn(DESTINATION_CHAIN_ID),
            constraints: [greaterThanOrEqualTo(1n)],
          }),
          chainId: DESTINATION_CHAIN_ID,
          spender: getAavePoolV3Address(DESTINATION_CHAIN_ID),
          tokenAddress: DESTINATION_TOKEN.addressOn(DESTINATION_CHAIN_ID),
        },
      };

      // Instruction 5: Supply to Aave
      const supplyAave = prepareAaveSupplyCall({
        tokenAddress: DESTINATION_TOKEN.addressOn(DESTINATION_CHAIN_ID),
        chainId: DESTINATION_CHAIN_ID,
        amount: runtimeERC20BalanceOf({
          targetAddress: orchestrator.addressOn(DESTINATION_CHAIN_ID)!,
          tokenAddress: DESTINATION_TOKEN.addressOn(DESTINATION_CHAIN_ID),
          constraints: [greaterThanOrEqualTo(1n)],
        }),
        recipientAddress: address as Address,
      });

      const supplyAaveTx: BuildComposableInstruction = {
        type: 'default',
        data: {
          chainId: DESTINATION_CHAIN_ID,
          abi: supplyAave.abi,
          to: supplyAave.address,
          functionName: supplyAave.functionName,
          // @ts-expect-error - args are typed and BuildComposableInstruction expects mutable any[]
          args: supplyAave.args,
        },
      };

      // Compile instructions
      const instructions = await Promise.all(
        [bridge, approveUniswap, swapTx, approveAave, supplyAaveTx].map(
          async (operation) => orchestrator.buildComposable(operation),
        ),
      );

      const fusionQuote = await meeClient?.getFusionQuote({
        trigger,
        instructions,
        cleanUps: [
          {
            chainId: SOURCE_CHAIN_ID,
            recipientAddress: address as Address,
            tokenAddress: SOURCE_TOKEN.addressOn(SOURCE_CHAIN_ID),
          },
        ],
        feeToken: {
          address: SOURCE_TOKEN.addressOn(SOURCE_CHAIN_ID),
          chainId: SOURCE_CHAIN_ID,
        },
      });

      return {
        fusionQuote,
      };
    },
  });

  // Biconomy Transaction Prompt
  const swap = useMutation({
    mutationFn: async () => {
      if (!fusionQuoteData?.fusionQuote) {
        throw new Error('Quote not ready');
      }

      const result = await meeClient?.executeFusionQuote({
        fusionQuote: fusionQuoteData.fusionQuote,
      });

      return result;
    },
  });

  // Biconomy Transaction
  const tx = useQuery({
    queryKey: ['biconomy-eoa-cross-chain-swap', swap.data?.hash],
    queryFn: async () => {
      if (!swap.data?.hash) {
        throw new Error('Transaction hash not found');
      }

      return meeClient?.waitForSupertransactionReceipt({
        hash: swap.data.hash,
      });
    },
    enabled: Boolean(swap.data?.hash),
  });

  const error = fusionQuoteError ?? swap.error ?? tx.error;
  const isFusionQuoteReady = Boolean(fusionQuoteQuery.isSuccess);

  return {
    // Data
    uniswap,
    fusionQuote: fusionQuoteData?.fusionQuote,
    // Status
    error,
    isFusionQuoteReady,
    // Actions
    execute: swap.mutate,
    // Queries
    fusionQuoteQuery,
    txQuery: tx,
    swapQuery: swap,
    // Utils
    meeScanLink: swap.data?.hash ? getMeeScanLink(swap.data.hash) : undefined,
  };
}
