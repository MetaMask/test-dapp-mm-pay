import { ConnectionStatus } from './components/connection-status';
import { IntegrationRouter } from './components/integration-router';
import { WalletProviderSelector } from './components/wallet-provider-selector';

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
        <div className="flex gap-2">
          <ModeToggle />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-8">
        <WalletProviderSelector>
          <ConnectionStatus />
          <IntegrationRouter />
        </WalletProviderSelector>
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
