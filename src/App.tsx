import { ConnectButton } from '@rainbow-me/rainbowkit';

import { IntegrationRouter } from './components/integration-router';

import { ModeToggle } from '@/components/mode-toggle';
import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Providers>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h1 className="flex gap-2 text-center text-2xl font-bold">
                <img className="size-8" src="src/assets/mm-logo.svg" />
                Pay Test DApp
              </h1>
              <div className="flex gap-2">
                <ConnectButton />
                <ModeToggle />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-8">
              <IntegrationRouter />
            </div>
          </div>
        </div>
      </Providers>
    </ThemeProvider>
  );
}

export default App;
