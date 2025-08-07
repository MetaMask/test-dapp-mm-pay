import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

import { TokenSelector } from '@/components/token-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { SwapComponentProps } from '@/types/swap';

export function Swap({
  tokens,
  swapData,
  quote,
  isLoading = false,
  isSwapping = false,
  callbacks,
  disabled = false,
}: SwapComponentProps) {
  const { fromToken, toToken, fromAmount, toAmount } = swapData;
  const {
    onTokenSelect,
    onAmountChange,
    onSwapTokens,
    onSwap,
    onQuoteRequest,
    onMaxAmount,
  } = callbacks;

  // Request quote when inputs change
  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0) {
      onQuoteRequest(fromToken, toToken, fromAmount);
    }
  }, [fromToken, toToken, fromAmount]);

  const canSwap =
    fromToken &&
    toToken &&
    fromAmount &&
    parseFloat(fromAmount) > 0 &&
    !isLoading &&
    !disabled;

  const handleSwap = () => {
    if (canSwap) {
      onSwap(swapData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Swap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* From Token Section */}
        <div className="space-y-2">
          <Label htmlFor="from-amount">From</Label>
          <div className="flex gap-2">
            <div className="w-32">
              <TokenSelector
                tokens={tokens}
                selectedToken={fromToken}
                onTokenSelect={(token) => onTokenSelect(token, 'from')}
                disabled={disabled}
                placeholder="Select"
              />
            </div>
            <div className="relative flex-1">
              <Input
                id="from-amount"
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(event) => onAmountChange(event.target.value, 'from')}
                disabled={disabled}
                className="pr-16"
              />
              {fromToken?.balance && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMaxAmount}
                  disabled={disabled}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                >
                  MAX
                </Button>
              )}
            </div>
          </div>
          {fromToken?.balance && (
            <p className="text-xs text-muted-foreground">
              Balance: {parseFloat(fromToken.balance).toFixed(4)}{' '}
              {fromToken.symbol}
            </p>
          )}
        </div>

        {/* Swap Direction Button */}
        {/* <div className="flex justify-center ">
          <Button
            variant="outline"
            size="icon"
            onClick={onSwapTokens}
            disabled={disabled}
            className="rounded-full border-2 bg-background hover:bg-muted"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div> */}

        {/* To Token Section */}
        <div className="space-y-2">
          <Label htmlFor="to-amount">To</Label>
          <div className="flex gap-2">
            <div className="w-32">
              <TokenSelector
                tokens={tokens}
                selectedToken={toToken}
                onTokenSelect={(token) => onTokenSelect(token, 'to')}
                disabled={disabled}
                placeholder="Select"
              />
            </div>
            <div className="flex-1">
              <Input
                id="to-amount"
                type="number"
                placeholder="0.0"
                value={toAmount}
                onChange={(event) => onAmountChange(event.target.value, 'to')}
                disabled={disabled}
              />
            </div>
          </div>
          {toToken?.balance && (
            <p className="text-xs text-muted-foreground">
              Balance: {parseFloat(toToken.balance).toFixed(4)} {toToken.symbol}
            </p>
          )}
        </div>

        {/* Quote Information */}
        {quote && fromToken && toToken && (
          <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span>
                1 {fromToken.symbol} = {quote.exchangeRate} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span
                className={(() => {
                  const impact = parseFloat(quote.priceImpact);
                  if (impact > 5) {
                    return 'text-destructive';
                  }
                  if (impact > 2) {
                    return 'text-yellow-600';
                  }
                  return 'text-green-600';
                })()}
              >
                {quote.priceImpact}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Received</span>
              <span>
                {quote.minimumReceived} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span>{quote.fee}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !quote && fromToken && toToken && fromAmount && (
          <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!canSwap || isSwapping}
          className="w-full"
          size="lg"
        >
          {(() => {
            if (isSwapping) {
              return (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Swapping...
                </div>
              );
            }
            if (!fromToken || !toToken) {
              return 'Select a token';
            }
            if (!fromAmount || parseFloat(fromAmount) === 0) {
              return 'Enter an amount';
            }
            return `Swap ${fromToken.symbol} for ${toToken.symbol}`;
          })()}
        </Button>
      </CardContent>
    </Card>
  );
}
