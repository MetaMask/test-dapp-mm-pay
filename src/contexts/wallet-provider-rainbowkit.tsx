import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { useTheme } from './theme-provider';

import { rootConfig } from '@/lib/wagmi';

const config = getDefaultConfig({
  ...rootConfig,
  appName: 'MM Pay Test DApp',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '',
});

const queryClient = new QueryClient();

export default function WalletProviderRainbowkit({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isDark = theme.actualTheme === 'dark';

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={isDark ? darkTheme() : lightTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
