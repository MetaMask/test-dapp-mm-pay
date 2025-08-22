export type Token = {
  id?: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  address: string;
  logoURI?: string;
  balance?: string;
};

export type SwapQuote = {
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
  minimumReceived: string;
  fee?: string;
  route?: string[];
};

export type SwapFormData = {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  slippageTolerance: number;
};

export type SwapCallbacks = {
  onTokenSelect: (token: Token, field: 'from' | 'to') => void;
  onAmountChange: (amount: string, field: 'from' | 'to') => void;
  onSwapTokens: () => void;
  onSwap: (swapData: SwapFormData) => void;
  onQuoteRequest?: (fromToken: Token, toToken: Token, amount: string) => void;
  onMaxAmount: () => void;
  onApprove?: (fromToken: Token, amount: string) => void;
};

export type SwapComponentProps = {
  tokens: Token[];
  swapData: SwapFormData;
  quote?: SwapQuote | null;
  isLoading?: boolean;
  isSwapping?: boolean;
  isApproving?: boolean;
  hasSufficientAllowance?: boolean;
  callbacks: SwapCallbacks;
  disabled?: boolean;
};
