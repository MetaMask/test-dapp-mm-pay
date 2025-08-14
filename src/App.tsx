import { ConnectButton } from '@rainbow-me/rainbowkit';

import { ModeToggle } from '@/components/mode-toggle';
import { NFTMinter } from '@/components/nft/nft-minter';
import { Providers } from '@/components/providers';
import { UniswapSwap } from '@/components/swap/uniswap-swap';
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
                <div className="flex justify-center">
                  <UniswapSwap />
                </div>
                <div className="flex justify-center">
                  <NFTMinter
                    contractAddress="0x097fF9Cf279Dab00080310490A9e6DeEF52C404a"
                    collectionName="Metamask Pay Test NFT"
                    collectionDescription="Test NFT collection"
                    collectionImage=""
                    mintFunctionName="mint"
                    priceFunctionName="mintPrice"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Providers>
    </ThemeProvider>
  );
}

export default App;
