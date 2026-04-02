import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  type Theme,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { WagmiProvider } from 'wagmi';

import { useTheme } from './theme-provider';

import { rootConfig } from '@/lib/wagmi';

const config = getDefaultConfig({
  ...rootConfig,
  appName: 'MM Pay Test DApp',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '',
});

const queryClient = new QueryClient();

const ORANGE_ACCENT = '#f97316';

function buildTheme(isDark: boolean): Theme {
  const base = isDark
    ? darkTheme({
        accentColor: ORANGE_ACCENT,
        accentColorForeground: '#ffffff',
      })
    : lightTheme({
        accentColor: ORANGE_ACCENT,
        accentColorForeground: '#ffffff',
      });

  return {
    ...base,
    colors: {
      ...base.colors,
      // Don't apply orange to the connected-state pill — that's handled by
      // our own WalletStatusBar cards. Restore the default inner gradient.
      connectButtonBackground: isDark ? '#1A1B1F' : '#ffffff',
      connectButtonInnerBackground: isDark
        ? 'linear-gradient(0deg, rgba(255,255,255,0.075), rgba(255,255,255,0.15))'
        : 'linear-gradient(0deg, rgba(0,0,0,0.03), rgba(0,0,0,0.06))',
    },
  };
}

export default function WalletProviderRainbowkit({
  children,
}: {
  children: React.ReactNode;
}) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const rkTheme = useMemo(() => buildTheme(isDark), [isDark]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rkTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
