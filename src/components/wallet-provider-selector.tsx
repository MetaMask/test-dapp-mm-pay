import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

import { useWalletProvider } from '@/contexts/wallet-provider-context';
import { cn, getConnectorLogo } from '@/lib/utils';

const isPrivyEnabled = Boolean(import.meta.env.VITE_PRIVY_APP_ID);
const isDynamicEnabled = Boolean(import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID);

export function WalletProviderSelector() {
  const { selectedProvider, setSelectedProvider } = useWalletProvider();

  const totalEnabled = [isDynamicEnabled, isPrivyEnabled].filter(
    Boolean,
  ).length;

  if (totalEnabled === 0) {
    return null;
  }

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
            <TabsList
              className={cn(
                'grid grid-cols-3 gap-x-1',
                totalEnabled === 1 && 'grid-cols-2',
              )}
            >
              <TabsTrigger
                value="rainbowkit"
                className="flex items-center gap-2"
              >
                <img
                  className="size-4"
                  src={getConnectorLogo()}
                  alt="RainbowKit"
                />
                RK
              </TabsTrigger>
              {isDynamicEnabled && (
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
              )}
              {isPrivyEnabled && (
                <TabsTrigger value="privy" className="flex items-center gap-2">
                  <img
                    className="size-4"
                    src={getConnectorLogo('Privy')}
                    alt="Privy"
                  />
                  Privy
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
