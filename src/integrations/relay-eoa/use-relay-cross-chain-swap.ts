import { useQuote } from '@reservoir0x/relay-kit-hooks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getClient } from '@reservoir0x/relay-sdk';
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWalletClient,
} from 'wagmi';

import type { UseUniswapParams } from '@/hooks/use-uniswap';

type CrossChainSwapParams = UseUniswapParams & {
  sourceChainId: number;
  destinationChainId: number;
};

const relayClient = getClient();

export function useRelayCrossChainSwap(params: CrossChainSwapParams) {
  const { data: walletClient } = useWalletClient();
  const quote = useQuote(
    relayClient,
    walletClient,
    {
      user: walletClient?.account?.address ?? '',
      originChainId: params.sourceChainId,
      destinationChainId: params.destinationChainId,
      originCurrency: params.fromToken?.address ?? '',
      destinationCurrency: params.toToken?.address ?? '',
      tradeType: 'EXACT_INPUT',
      amount: params.amount,
    },
    () => {
      console.log('Quote Request Triggered!');
    },
    (data) => {
      console.log('Quote Response Returned!', data);
    },
    { enabled: Boolean(walletClient?.account?.address) },
  );

  const tx = useSendTransaction();
  const receipt = useWaitForTransactionReceipt({
    hash: tx.data,
  });

  const handleSwap = () => {
    if (!quote.data) {
      console.log('No quote data');
      return;
    }
    const { steps } = quote.data;
    const [depositStep] = steps ?? [];
    const [depositStepTx] = depositStep?.items ?? [];
    const { data: txData } = depositStepTx;

    if (!txData) {
      console.log('No deposit tx data');
      return;
    }

    tx.sendTransaction({
      chainId: txData.chainId,
      to: txData.to,
      value: txData.value,
      data: txData.data,
      maxFeePerGas: txData.maxFeePerGas,
      maxPriorityFeePerGas: txData.maxPriorityFeePerGas,
      gas: txData.gas,
    });
  };

  console.log({ depositReceipt: receipt });
  return {
    quote,
    handleSwap,
  };
}
