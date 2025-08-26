import { AaveClient, AaveProvider } from '@aave/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { privyConfig } from '@/lib/wagmi';

export const aaveClient = AaveClient.create();

const queryClient = new QueryClient();

type WalletProviderPrivyProps = {
  children: ReactNode;
};

export function WalletProviderPrivy({ children }: WalletProviderPrivyProps) {
  return (
    <PrivyProvider appId={import.meta.env.VITE_PRIVY_APP_ID}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={privyConfig}>
          <AaveProvider client={aaveClient}>{children}</AaveProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
