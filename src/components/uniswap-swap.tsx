import { useState, useCallback, useEffect, useMemo } from 'react';
import { type Address, formatUnits, parseUnits } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';

import { Swap } from '@/components/swap';
import { useTokenAllowance } from '@/hooks/use-token-allowance';
import { useUniswap } from '@/hooks/use-uniswap';
import {
  getTokensForChain,
  getUniswapSwapRouterAddress,
  isUniswapV3Supported,
} from '@/lib/uniswap';
import type { SwapFormData, Token, SwapQuote } from '@/types/swap';

export function UniswapSwap() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const tokens = getTokensForChain(chainId);

  const [swapData, setSwapData] = useState<SwapFormData>({
    fromToken: tokens.find((token) => token.symbol === 'WETH') ?? null,
    toToken: tokens.find((token) => token.symbol === 'USDC') ?? null,
    fromAmount: '',
    toAmount: '',
    slippageTolerance: 0.5,
  });

  const {
    quote: quoteResult,
    isLoading,
    isReady,
    handleSwap: swap,
    error: swapError,
    hasTransactionSucceeded,
    isWaitingUserConfirmation,
    isWaitingChainConfirmation,
  } = useUniswap({
    fromToken: swapData.fromToken,
    toToken: swapData.toToken,
    amount: swapData.fromAmount,
    chainId,
    slippageTolerance: swapData.slippageTolerance,
  });

  const fromAmount = swapData.fromAmount
    ? parseUnits(swapData.fromAmount, swapData.fromToken?.decimals ?? 18)
    : 0n;

  const { approve, hasAllowance, isApproving } = useTokenAllowance(
    getUniswapSwapRouterAddress(chainId) as Address,
    swapData.fromToken?.address as Address,
    fromAmount,
  );

  // Get available tokens for the current chain
  const availableTokens = getTokensForChain(chainId);

  // Create quote object compatible with Swap component
  const quote: SwapQuote | null = useMemo(
    () =>
      quoteResult
        ? {
            fromAmount: swapData.fromAmount,
            toAmount: quoteResult.outputAmount,
            exchangeRate: (
              parseFloat(quoteResult.outputAmount) /
              parseFloat(swapData.fromAmount)
            ).toString(),
            priceImpact: quoteResult.priceImpact,
            minimumReceived: quoteResult.minimumReceivedDecimal,
            route: [
              swapData.fromToken?.symbol ?? '',
              swapData.toToken?.symbol ?? '',
            ],
          }
        : null,
    [quoteResult, swapData.fromAmount, swapData.toAmount],
  );

  // Get token balances
  const { data: fromTokenBalance, refetch: refetchFromTokenBalance } =
    useBalance({
      address,
      token: swapData.fromToken?.address as `0x${string}` | undefined,
      query: {
        enabled: Boolean(swapData.fromToken?.address) && isConnected,
      },
    });

  const { data: toTokenBalance, refetch: refetchToTokenBalance } = useBalance({
    address,
    token: swapData.toToken?.address as `0x${string}` | undefined,
    query: {
      enabled: Boolean(swapData.toToken?.address) && isConnected,
    },
  });

  // Update balances after a successful swap
  useEffect(() => {
    if (hasTransactionSucceeded) {
      refetchFromTokenBalance().catch(console.error);
      refetchToTokenBalance().catch(console.error);
    }
  }, [hasTransactionSucceeded]);

  // Update token balances when available
  // fromToken balance update
  useEffect(() => {
    if (fromTokenBalance && swapData.fromToken) {
      setSwapData((prev) => ({
        ...prev,
        fromToken: {
          ...prev.fromToken!,
          balance: formatUnits(
            fromTokenBalance.value,
            fromTokenBalance.decimals,
          ),
        },
      }));
    }
  }, [fromTokenBalance, swapData.fromToken?.symbol, chainId]);

  // toToken balance update
  useEffect(() => {
    if (toTokenBalance && swapData.toToken) {
      setSwapData((prev) => ({
        ...prev,
        toToken: {
          ...prev.toToken!,
          balance: formatUnits(toTokenBalance.value, toTokenBalance.decimals),
        },
      }));
    }
  }, [toTokenBalance, swapData.toToken?.symbol, chainId]);

  // Update toAmount when a quote is available
  useEffect(() => {
    if (quote && quote.toAmount !== swapData.toAmount) {
      setSwapData((prev) => ({
        ...prev,
        toAmount: quote.toAmount,
      }));
    }
  }, [quote?.toAmount]);

  const handleTokenSelect = useCallback(
    (token: Token, field: 'from' | 'to') => {
      setSwapData((prev) => ({
        ...prev,
        [field === 'from' ? 'fromToken' : 'toToken']: token,
      }));
    },
    [],
  );

  const handleAmountChange = useCallback(
    (amount: string, field: 'from' | 'to') => {
      setSwapData((prev) => ({
        ...prev,
        [field === 'from' ? 'fromAmount' : 'toAmount']: amount,
      }));
    },
    [],
  );

  const handleSwapPositions = useCallback(() => {
    setSwapData((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount || '',
      toAmount: '',
    }));
  }, []);

  const handleMaxAmount = useCallback(() => {
    if (swapData.fromToken?.balance) {
      handleAmountChange(swapData.fromToken.balance, 'from');
    }
  }, [swapData.fromToken?.balance, handleAmountChange]);

  if (!isConnected) {
    return (
      <div className="w-full max-w-md mx-auto p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to use Uniswap swaps
        </p>
      </div>
    );
  }

  if (!isUniswapV3Supported(chainId)) {
    return (
      <div className="w-full max-w-md mx-auto p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">
          Uniswap V3 is not supported on this chain
        </h3>
        <p className="text-muted-foreground">Please use a different chain</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Uniswap Swap</h2>
        <p className="text-sm text-muted-foreground">
          Swaps powered by Uniswap V3
        </p>
        <p className="text-xs text-green-600">
          {isReady ? 'Ready to swap ✓' : 'Loading quotes...'}
        </p>
        {swapError && (
          <p className="text-xs text-red-600">Error: {swapError.message}</p>
        )}
      </div>

      <Swap
        disabled={!isConnected}
        tokens={availableTokens}
        swapData={swapData}
        quote={quote}
        isLoading={Boolean(isLoading)}
        isSwapping={isWaitingUserConfirmation || isWaitingChainConfirmation}
        isApproving={isApproving}
        hasSufficientAllowance={hasAllowance}
        callbacks={{
          onTokenSelect: handleTokenSelect,
          onAmountChange: handleAmountChange,
          onSwapTokens: handleSwapPositions,
          onMaxAmount: handleMaxAmount,
          onSwap: swap,
          onApprove: approve,
        }}
      />
    </div>
  );
}
