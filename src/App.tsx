import { ConnectButton } from '@rainbow-me/rainbowkit';

import { IntegrationRouter } from '@/components/integration-router';
import { ModeToggle } from '@/components/mode-toggle';
import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Providers>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4 gap-2">
              <h1 className="text-2xl font-bold text-center flex gap-2">
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
