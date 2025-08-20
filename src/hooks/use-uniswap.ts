import type { RuntimeValue } from '@biconomy/abstractjs';
import { useQuery } from '@tanstack/react-query';
import { CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import QuoterV2 from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json';
import {
  computePoolAddress,
  FeeAmount,
  Route,
  Pool,
  Trade,
} from '@uniswap/v3-sdk';
import { useCallback } from 'react';
import type { Address } from 'viem';
import { formatUnits, getContract, parseUnits } from 'viem';
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract,
} from 'wagmi';

import { abi as SWAP_ROUTER_ABI } from '../abis/swap-router-abi';
import {
  getUniswapFactoryAddress,
  getUniswapQuoterAddress,
  getUniswapSwapRouterAddress,
  toUniswapToken,
} from '../lib/uniswap';

import type { Token } from '@/types/swap';

/**
 * Parameters for the Uniswap hook.
 */
export type UseUniswapParams = {
  fromToken: Token | null;
  toToken: Token | null;
  amount: string;
  chainId: number;
  slippageTolerance?: number; // in percentage, e.g., 0.5 for 0.5%
};

/**
 * Quote result type.
 */
type QuoteResult = {
  amountOut: bigint;
  poolInfo: {
    fee: FeeAmount;
    liquidity: bigint;
    slot0: unknown;
  };
  outputAmount: string;
  minimumReceivedWei: bigint;
  minimumReceivedDecimal: string;
  slippageAmountDecimal: string;
  slippagePercent: number;
  priceImpact: string;
  trade: Trade<any, any, TradeType.EXACT_INPUT>;
};

/**
 * Hook for getting Uniswap quotes and executing swaps.
 * @param params - The swap parameters including tokens, amount, and chain.
 * @returns Quote data, swap functions, and loading states.
 */
export function useUniswap(params: UseUniswapParams) {
  const {
    fromToken,
    toToken,
    amount,
    chainId,
    slippageTolerance = 0.5,
  } = params;
  const { address: account } = useAccount();
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  const hasSufficientBalance =
    fromToken && parseFloat(amount) > parseFloat(fromToken.balance ?? '0');

  // Swap transaction handlers
  const { data: hash, ...swapCall } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  // Check if we have all required parameters
  const hasRequiredParams =
    chainId && fromToken && toToken && amount && parseFloat(amount) > 0;

  // Convert tokens to Uniswap format
  const fromUniToken = hasRequiredParams
    ? toUniswapToken(fromToken, chainId)
    : null;
  const toUniToken = hasRequiredParams
    ? toUniswapToken(toToken, chainId)
    : null;

  const {
    data: quote,
    isSuccess: isQuoteReady,
    error: quoteError,
  } = useQuery<QuoteResult>({
    queryKey: [
      'quote',
      fromToken?.symbol,
      toToken?.symbol,
      amount.toString(),
      chainId,
    ],
    enabled: Boolean(hasRequiredParams && publicClient),
    queryFn: async () => {
      const quoterContractAddress = getUniswapQuoterAddress(chainId);
      const poolFactoryContractAddress = getUniswapFactoryAddress(chainId);

      if (!hasRequiredParams || !fromUniToken || !toUniToken || !publicClient) {
        throw new Error('Missing required parameters for quote');
      }

      console.log(
        'Getting quote',
        fromToken.symbol,
        '→',
        toToken.symbol,
        amount,
      );

      const currentPoolAddress = computePoolAddress({
        factoryAddress: poolFactoryContractAddress,
        tokenA: fromUniToken,
        tokenB: toUniToken,
        fee: FeeAmount.MEDIUM,
      });

      console.log('Current pool address', currentPoolAddress);

      if (!currentPoolAddress) {
        throw new Error('Unable to compute pool address');
      }

      const poolContract = getContract({
        address: currentPoolAddress as Address,
        abi: IUniswapV3PoolABI.abi,
        client: publicClient,
      });

      if (!poolContract) {
        throw new Error('Unable to create Pool contract instance');
      }

      const fee = await poolContract.read.fee?.();

      const amountInWei = parseUnits(amount, fromToken.decimals);

      const quoteCall = await publicClient.simulateContract({
        account: account as Address,
        address: quoterContractAddress,
        abi: QuoterV2.abi,
        functionName: 'quoteExactInputSingle',
        args: [
          {
            tokenIn: fromUniToken.address,
            tokenOut: toUniToken.address,
            amountIn: amountInWei,
            fee,
            sqrtPriceLimitX96: 0n,
          },
        ],
      });

      const amountOut = quoteCall?.result[0] as unknown as bigint;

      if (!amountOut) {
        throw new Error('Unable to get a quote');
      }

      const [liquidity, slot0] = (await Promise.all([
        poolContract.read.liquidity?.(),
        poolContract.read.slot0?.(),
      ])) as [bigint, [string, number]];

      const [sqrtPriceX96, tick] = slot0;

      const pool = new Pool(
        fromUniToken,
        toUniToken,
        fee as FeeAmount,
        sqrtPriceX96.toString(),
        liquidity.toString(),
        tick,
      );

      const route = new Route([pool], fromUniToken, toUniToken);

      const uncheckedTrade = Trade.createUncheckedTrade({
        route,
        inputAmount: CurrencyAmount.fromRawAmount(
          fromUniToken,
          parseUnits(amount, fromUniToken.decimals).toString(),
        ),
        outputAmount: CurrencyAmount.fromRawAmount(
          toUniToken,
          amountOut.toString(),
        ),
        tradeType: TradeType.EXACT_INPUT,
      });

      const priceImpact = uncheckedTrade.priceImpact.toFixed(2);
      const outputAmount = uncheckedTrade.outputAmount.toExact();

      const minimumReceived = calculateSlippage(
        outputAmount,
        toUniToken.decimals,
        slippageTolerance,
      );

      return {
        trade: uncheckedTrade,
        priceImpact,
        ...minimumReceived,
        amountOut,
        poolInfo: {
          fee: fee as FeeAmount,
          liquidity,
          slot0,
        },
      };
    },
  });

  if (quoteError) {
    console.error('[QUOTE ERROR]', quoteError);
  }

  const handleSwap = useCallback(() => {
    if (
      !isQuoteReady ||
      !hasRequiredParams ||
      !fromUniToken ||
      !toUniToken ||
      !walletClient ||
      !account
    ) {
      console.log('Transaction not ready - missing required data');
      return;
    }

    const swapRouterAddress = getUniswapSwapRouterAddress(chainId);

    const { minimumReceivedWei } = quote;

    swapCall.writeContract({
      abi: SWAP_ROUTER_ABI,
      address: swapRouterAddress,
      functionName: 'exactInputSingle',
      args: [
        {
          tokenIn: fromUniToken.address as Address,
          tokenOut: toUniToken.address as Address,
          fee: FeeAmount.MEDIUM,
          recipient: account,
          amountIn: parseUnits(amount, fromUniToken.decimals),
          amountOutMinimum: minimumReceivedWei,
          sqrtPriceLimitX96: 0n,
        },
      ],
    });
  }, [
    isQuoteReady,
    hasRequiredParams,
    fromUniToken,
    toUniToken,
    walletClient,
    account,
    quote,
    chainId,
    swapCall,
  ]);

  const isReady = isQuoteReady && hasRequiredParams;
  const isWaitingUserConfirmation = swapCall.isPending;
  const isWaitingChainConfirmation = receipt.isLoading;
  const error = receipt.error ?? swapCall.error ?? quoteError;

  return {
    quote,
    isQuoteReady,
    isReady,
    handleSwap,
    error,
    receipt,
    isLoading: !isQuoteReady && hasRequiredParams,
    hasTransactionSucceeded: receipt.isSuccess,
    isWaitingUserConfirmation,
    isWaitingChainConfirmation,
    hasSufficientBalance,
  };
}

/**
 * Calculates the minimum amount to receive after applying slippage tolerance.
 * @param outputAmount - The expected output amount as a decimal string (e.g., "1000.123456").
 * @param tokenDecimals - The number of decimals for the output token.
 * @param slippagePercent - The slippage tolerance as a percentage (e.g., 1.5 for 1.5%).
 * @returns An object containing the original output amount, minimum received in wei and decimal, slippage amount in decimal, and slippage percent.
 */
function calculateSlippage(
  outputAmount: string,
  tokenDecimals: number,
  slippagePercent: number,
) {
  // Convert to BigInt for precise calculations
  const outputAmountWei = parseUnits(outputAmount, tokenDecimals);

  // Calculate slippage amount
  const slippageMultiplier = BigInt(Math.floor(slippagePercent * 100)); // Convert to basis points
  const slippageAmount = (outputAmountWei * slippageMultiplier) / 10000n;

  // Calculate minimum received
  const minimumReceived = outputAmountWei - slippageAmount;

  return {
    outputAmount,
    minimumReceivedWei: minimumReceived,
    minimumReceivedDecimal: formatUnits(minimumReceived, tokenDecimals),
    slippageAmountDecimal: formatUnits(slippageAmount, tokenDecimals),
    slippagePercent,
  };
}

export function prepareUniswapSwapTransaction(
  params: Omit<UseUniswapParams, 'amount'> & {
    minimumReceivedWei: bigint;
    recipient: Address;
    amount: bigint | RuntimeValue;
  },
) {
  const { fromToken, toToken, amount, chainId } = params;
  if (!fromToken || !toToken) {
    throw new Error('Missing required parameters for quote');
  }

  return {
    abi: SWAP_ROUTER_ABI,
    address: getUniswapSwapRouterAddress(chainId),
    functionName: 'exactInputSingle',
    args: [
      {
        tokenIn: fromToken.address as Address,
        tokenOut: toToken.address as Address,
        fee: FeeAmount.MEDIUM,
        recipient: params.recipient,
        amountIn: amount,
        amountOutMinimum: params.minimumReceivedWei,
        sqrtPriceLimitX96: 0n,
      },
    ],
  };
}
