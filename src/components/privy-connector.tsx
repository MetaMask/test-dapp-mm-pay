import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from './ui/button';
import { InfoRow } from './info-row';
import { useAccount } from 'wagmi';
import { getChainLogo, getConnectorLogo, trimAddress } from '@/lib/utils';
import { useEffect } from 'react';
import { useSetActiveWallet } from '@privy-io/wagmi';

export function PrivyConnector() {
  const { ready, authenticated, login, logout, user, ...privy } = usePrivy();
  const wallets = useWallets();
  const account = useAccount();

  console.log({ wallets });
  if (!ready) {
    return <div>Loading...</div>;
  }
  console.log({ user, account });

  return (
    <div>
      <Button
        onClick={() => {
          if (authenticated) {
            logout().catch(console.error);
          } else {
            login();
          }
        }}
      >
        {authenticated ? 'Logout' : 'Login'}
      </Button>
      <Button
        onClick={() => {
          privy.connectOrCreateWallet();
        }}
      >
        Connect Wallet
      </Button>
      <InfoRow label="Authenticated" children={authenticated.toString()} />
      <InfoRow label="Address" children={trimAddress(user?.wallet?.address)} />
    </div>
  );
}
