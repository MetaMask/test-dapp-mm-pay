import { AaveClient, AaveProvider } from '@aave/react';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { WagmiProvider } from '@privy-io/wagmi';

import { useTheme } from '@/components/theme-provider';
import { privyConfig } from '@/lib/wagmi';
import { PrivyProvider } from '@privy-io/react-auth';

export const aaveClient = AaveClient.create();

const queryClient = new QueryClient();

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const { theme } = useTheme();

  return (
    <PrivyProvider appId={import.meta.env.VITE_PRIVY_APP_ID}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={privyConfig}>
          <AaveProvider client={aaveClient}>
            <RainbowKitProvider
              theme={theme === 'dark' ? darkTheme() : lightTheme()}
              showRecentTransactions={true}
            >
              {children}
            </RainbowKitProvider>
          </AaveProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
