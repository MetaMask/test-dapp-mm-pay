import { ConnectionStatus } from './components/connection-status';
import { WalletProviderRenderer } from './components/wallet-provider-renderer';
import { WalletProviderSelector } from './components/wallet-provider-selector';
import { BiconomyCard } from './integrations/biconomy/biconomy-card';
import { RelayCard } from './integrations/relay/relay-card';

import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { WalletProviderContextProvider } from '@/contexts/wallet-provider-context';

function AppContent() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="flex gap-2 text-center text-2xl font-bold">
          <img className="size-8" src="src/assets/mm-logo.svg" />
          Pay Test DApp
        </h1>
        <div className="flex items-center gap-x-2">
          <WalletProviderSelector />
          <ModeToggle />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-8">
        <WalletProviderRenderer>
          <div className="flex flex-col items-center space-y-4">
            <ConnectionStatus />
            <div className="flex gap-x-4">
              <BiconomyCard />
              <RelayCard />
            </div>
          </div>
        </WalletProviderRenderer>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WalletProviderContextProvider>
        <AppContent />
      </WalletProviderContextProvider>
    </ThemeProvider>
  );
}

export default App;
