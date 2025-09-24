import { WalletProvider } from '@/constants/wallets';
import { useWalletProvider } from '@/contexts/wallet-provider-context';
import WalletProviderDynamic from '@/contexts/wallet-provider-dynamic';
import WalletProviderPrivy from '@/contexts/wallet-provider-privy';
import WalletProviderRainbowkit from '@/contexts/wallet-provider-rainbowkit';

type WalletProviderSelectorProps = {
  children: React.ReactNode;
};

export function WalletProviderRenderer({
  children,
}: WalletProviderSelectorProps) {
  const { selectedProvider } = useWalletProvider();

  return (
    <div>
      {selectedProvider === WalletProvider.Dynamic && (
        <WalletProviderDynamic>{children}</WalletProviderDynamic>
      )}

      {selectedProvider === WalletProvider.Privy && (
        <WalletProviderPrivy>{children}</WalletProviderPrivy>
      )}

      {selectedProvider === WalletProvider.Rainbowkit && (
        <WalletProviderRainbowkit>{children}</WalletProviderRainbowkit>
      )}
    </div>
  );
}
