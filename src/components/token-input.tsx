import { TokenSelector } from './swap/token-selector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import type { Token } from '@/types/swap';

export type TokenInputProps = {
  label?: string;
  amount?: string;
  tokens: Token[];
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  onAmountChange: (amount: string) => void;
  onMaxAmount: () => void;
  disabled?: boolean;
  balance?: string;
};

export function TokenInput({
  label = '',
  amount,
  tokens,
  selectedToken,
  onTokenSelect,
  onAmountChange,
  onMaxAmount,
  disabled,
  balance,
}: TokenInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="from-amount">{label}</Label>
      <div className="flex gap-2">
        <div className="w-32">
          <TokenSelector
            tokens={tokens}
            selectedToken={selectedToken}
            onTokenSelect={onTokenSelect}
            disabled={disabled}
            placeholder="Select"
          />
        </div>
        <div className="relative flex-1">
          <Input
            id="from-amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            disabled={disabled}
            className="pr-16"
          />
          {balance && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMaxAmount}
              disabled={disabled}
              className="absolute right-1 top-1/2 h-6 -translate-y-1/2 px-2 text-xs"
            >
              MAX
            </Button>
          )}
        </div>
      </div>
      {balance && (
        <p className="text-right text-xs text-muted-foreground">
          Balance: {parseFloat(balance).toFixed(4)} {selectedToken.symbol}
        </p>
      )}
    </div>
  );
}
