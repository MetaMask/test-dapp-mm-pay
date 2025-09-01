import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

import { useWalletProvider } from '@/contexts/wallet-provider-context';
import { getConnectorLogo } from '@/lib/utils';

export function WalletProviderSelector() {
  const { selectedProvider, setSelectedProvider } = useWalletProvider();

  return (
    <div className="">
      <div className="container mx-auto py-4">
        {/* Provider Selection Tabs */}
        <div className="flex justify-center">
          <Tabs
            value={selectedProvider}
            onValueChange={(value) =>
              setSelectedProvider(value as 'dynamic' | 'privy')
            }
          >
            <TabsList className="grid grid-cols-2 gap-x-1">
              <TabsTrigger
                value="dynamic"
                className="flex items-center gap-2 px-2"
              >
                <img
                  className="size-4"
                  src={getConnectorLogo('Dynamic')}
                  alt="Dynamic"
                />
                Dynamic
              </TabsTrigger>
              <TabsTrigger value="privy" className="flex items-center gap-2">
                <img
                  className="size-4"
                  src={getConnectorLogo('Privy')}
                  alt="Privy"
                />
                Privy
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
