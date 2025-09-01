import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

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
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
