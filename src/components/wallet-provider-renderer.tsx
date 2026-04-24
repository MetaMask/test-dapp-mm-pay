import WalletProviderRainbowkit from '@/contexts/wallet-provider-rainbowkit';

type WalletProviderRendererProps = {
  children: React.ReactNode;
};

export function WalletProviderRenderer({
  children,
}: WalletProviderRendererProps) {
  return <WalletProviderRainbowkit>{children}</WalletProviderRainbowkit>;
}
