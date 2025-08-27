import { useAccount } from 'wagmi';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { InfoRow } from './info-row';
import { getChainLogo, getConnectorLogo, trimAddress } from '@/lib/utils';
import { PrivyConnector } from './privy-connector';
import { useWalletProvider } from '@/contexts/wallet-provider-context';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

export function ConnectionStatus() {
  const { selectedProvider } = useWalletProvider();
  const account = useAccount();
  const isEmbedded = account.connector?.id.includes('dynamicwaas');

  console.log(account);

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Connection Status</CardTitle>
        {selectedProvider === 'privy' ? <PrivyConnector /> : <DynamicWidget />}
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
          <div>Not connected</div>
        )}
      </CardContent>
    </Card>
  );
}
