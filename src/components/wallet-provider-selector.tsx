import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WalletProviderPrivy } from './wallet-provider-privy';
import WalletProviderDynamic from './wallet-provider-dynamic';
import { getConnectorLogo } from '@/lib/utils';
import { useWalletProvider } from '@/contexts/wallet-provider-context';

type WalletProviderSelectorProps = {
  children: React.ReactNode;
};

export function WalletProviderSelector({
  children,
}: WalletProviderSelectorProps) {
  const { selectedProvider, setSelectedProvider } = useWalletProvider();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        {/* Provider Selection Tabs */}
        <div className="mb-6 flex justify-center">
          <Tabs
            value={selectedProvider}
            onValueChange={(value) =>
              setSelectedProvider(value as 'dynamic' | 'privy')
            }
          >
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="dynamic" className="flex items-center gap-2">
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

            {selectedProvider === 'dynamic' && (
              <TabsContent value="dynamic">
                <WalletProviderDynamic>{children}</WalletProviderDynamic>
              </TabsContent>
            )}

            {selectedProvider === 'privy' && (
              <TabsContent value="privy">
                <WalletProviderPrivy>{children}</WalletProviderPrivy>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
