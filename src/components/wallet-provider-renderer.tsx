import WalletProviderDynamic from '../contexts/wallet-provider-dynamic';
import { WalletProviderPrivy } from '../contexts/wallet-provider-privy';

import { useWalletProvider } from '@/contexts/wallet-provider-context';

type WalletProviderSelectorProps = {
  children: React.ReactNode;
};

export function WalletProviderRenderer({
  children,
}: WalletProviderSelectorProps) {
  const { selectedProvider } = useWalletProvider();

  return (
    <div>
      {selectedProvider === 'dynamic' && (
        <WalletProviderDynamic>{children}</WalletProviderDynamic>
      )}

      {selectedProvider === 'privy' && (
        <WalletProviderPrivy>{children}</WalletProviderPrivy>
      )}
    </div>
  );
}
