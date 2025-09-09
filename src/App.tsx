import metamaskLogo from './assets/mm-logo.svg';
import { AaveAccountStatus } from './components/aave-account-status';
import { ConnectionStatus } from './components/connection-status';
import { WalletProviderRenderer } from './components/wallet-provider-renderer';
import { WalletProviderSelector } from './components/wallet-provider-selector';
import { ActionCards } from './integrations/action-cards';

import { ModeToggle } from '@/components/mode-toggle';
import { AaveProvider } from '@/contexts/aave-provider';
import { ThemeProvider } from '@/contexts/theme-provider';
import { WalletProviderContextProvider } from '@/contexts/wallet-provider-context';

function AppContent() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="flex gap-2 text-center text-2xl font-bold">
          <img className="size-8" src={metamaskLogo} />
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
            <div className="flex w-full justify-between gap-x-4">
              <ConnectionStatus />
              <AaveAccountStatus />
            </div>
            <ActionCards />
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
        <AaveProvider>
          <AppContent />
        </AaveProvider>
      </WalletProviderContextProvider>
    </ThemeProvider>
  );
}

export default App;
