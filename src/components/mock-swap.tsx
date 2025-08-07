import { useState, useCallback } from 'react';

import { Swap } from '@/components/swap';
import type { SwapFormData, Token, SwapQuote } from '@/types/swap';

interface MockSwapProps {
  tokens: Token[];
}

export function MockSwap({ tokens }: MockSwapProps) {
  const [swapData, setSwapData] = useState<SwapFormData>({
    fromToken: null,
    toToken: null,
    fromAmount: '',
    toAmount: '',
    slippageTolerance: 0.5,
  });

  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

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

  const handleSwapTokens = useCallback(() => {
    setSwapData((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));
  }, []);

  const handleQuoteRequest = useCallback(
    async (_fromToken: Token, _toToken: Token, amount: string) => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockQuote: SwapQuote = {
          fromAmount: amount,
          toAmount: (parseFloat(amount) * 2000).toString(), // Mock conversion rate
          exchangeRate: '2000.00',
          priceImpact: '0.15',
          minimumReceived: (parseFloat(amount) * 2000 * 0.995).toString(),
          fee: '0.003 ETH',
        };
        setQuote(mockQuote);
        setSwapData((prev) => ({
          ...prev,
          toAmount: mockQuote.toAmount,
        }));
        setIsLoading(false);
      }, 1000);
    },
    [],
  );

  const handleSwap = useCallback(async (swapFormData: SwapFormData) => {
    setIsSwapping(true);
    // Simulate swap transaction
    setTimeout(() => {
      console.log(
        `Swapped ${swapFormData.fromAmount} ${
          swapFormData.fromToken?.symbol ?? ''
        } for ${swapFormData.toAmount} ${swapFormData.toToken?.symbol ?? ''}`,
      );
      setIsSwapping(false);
    }, 3000);
  }, []);

  const handleMaxAmount = useCallback(() => {
    if (swapData.fromToken?.balance) {
      handleAmountChange(swapData.fromToken.balance, 'from');
    }
  }, [swapData.fromToken?.balance, handleAmountChange]);

  return (
    <Swap
      tokens={tokens}
      swapData={swapData}
      quote={quote}
      isLoading={isLoading}
      isSwapping={isSwapping}
      callbacks={{
        onTokenSelect: handleTokenSelect,
        onAmountChange: handleAmountChange,
        onSwapTokens: handleSwapTokens,
        onSwap: handleSwap,
        onQuoteRequest: handleQuoteRequest,
        onMaxAmount: handleMaxAmount,
      }}
    />
  );
}
