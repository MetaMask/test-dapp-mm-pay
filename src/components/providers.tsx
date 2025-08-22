import { AaveClient, AaveProvider } from '@aave/react';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { useTheme } from '@/components/theme-provider';
import { config } from '@/lib/wagmi';

export const aaveClient = AaveClient.create();

const queryClient = new QueryClient();

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const { theme } = useTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AaveProvider client={aaveClient}>
          <RainbowKitProvider
            theme={theme === 'dark' ? darkTheme() : lightTheme()}
            showRecentTransactions={true}
          >
            {children}
          </RainbowKitProvider>
        </AaveProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
