import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { InfoRow } from './info-row';
import { PrivyConnector } from './privy-connector';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { useWalletProvider } from '@/contexts/wallet-provider-context';
import { getChainLogo, getConnectorLogo } from '@/lib/utils';

const EMBEDDED_CONNECTOR_IDS = ['dynamicwaas', 'privy'];

export function ConnectionStatus() {
  const { selectedProvider } = useWalletProvider();
  const account = useAccount();
  const isEmbedded = EMBEDDED_CONNECTOR_IDS.some((id) =>
    (account.connector?.id ?? '').includes(id),
  );

  return (
    <Card className="h-[200px] w-2/3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Connection Status</CardTitle>
        {selectedProvider === 'privy' && <PrivyConnector />}
        {selectedProvider === 'dynamic' && <DynamicWidget />}
        {selectedProvider === 'rainbowkit' && <ConnectButton />}
      </CardHeader>
      <CardContent className="min-w-96">
        {account.isConnected ? (
          <div className="">
            <InfoRow
              label="Connector"
              children={account.connector?.name}
              imageURL={getConnectorLogo(account.connector?.name ?? '')}
            />
            <InfoRow
              label="Wallet Type"
              children={isEmbedded ? 'Embedded' : 'Injected'}
            />
            <InfoRow label="Address" children={account.address} />
            <InfoRow
              label="Chain"
              children={account.chain?.name}
              imageURL={getChainLogo(account.chain?.id ?? 0)}
            />
          </div>
        ) : (
          <div className="text-center text-2xl font-bold">
            No wallet connected
          </div>
        )}
      </CardContent>
    </Card>
  );
}
