import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trimNumber } from '@/lib/utils';
import type { Token } from '@/types/swap';

type TokenSelectorProps = {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function TokenSelector({
  tokens,
  selectedToken,
  onTokenSelect,
  disabled = false,
  placeholder = 'Select token',
}: TokenSelectorProps) {
  const handleValueChange = (value: string) => {
    const token = tokens.find(
      (tokenItem) => tokenItem.symbol.toLowerCase() === value.toLowerCase(),
    );
    if (token) {
      onTokenSelect(token);
    }
  };

  return (
    <Select
      value={selectedToken?.symbol.toLowerCase() ?? ''}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {selectedToken && (
            <div className="flex items-center gap-2">
              {selectedToken.logoURI && (
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="font-medium">{selectedToken.symbol}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.symbol} value={token.symbol.toLowerCase()}>
            <div className="flex items-center gap-2">
              {token.logoURI && (
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{token.symbol}</span>
                <span className="text-xs text-muted-foreground">
                  {token.name}
                </span>
              </div>
              {token.balance && parseFloat(token.balance) > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {trimNumber(token.balance)}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
