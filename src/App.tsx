import { ConnectButton } from '@rainbow-me/rainbowkit';

import { ModeToggle } from '@/components/mode-toggle';
import { MockSwap } from '@/components/mock-swap';
import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/theme-provider';
import type { Token } from '@/types/swap';

// Mock token data
const mockTokens: Token[] = [
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    balance: '2.5',
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI:
      'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    balance: '1000.0',
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    balance: '500.0',
  },
  {
    id: 'wbtc',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logoURI:
      'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    balance: '0.1',
  },
];

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Providers>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-end items-center mb-4 gap-2">
              <ConnectButton />
              <ModeToggle />
            </div>
            <div className="flex flex-col items-center space-y-8">
              <h1 className="text-4xl font-bold text-center">
                MetaMask Pay DApp
              </h1>

              <MockSwap tokens={mockTokens} />
            </div>
          </div>
        </div>
      </Providers>
    </ThemeProvider>
  );
}

export default App;
