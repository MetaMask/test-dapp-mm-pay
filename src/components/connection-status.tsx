/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { InfoRow } from './info-row';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import rainbowkitIcon from '@/assets/rainbowkit-icon.svg';
import { getChainLogo } from '@/lib/utils';

export function ConnectionStatus(props: { extendedDetails?: boolean }) {
  const account = useAccount();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Status</CardTitle>
        <ConnectButton />
      </CardHeader>
      {props.extendedDetails && (
        <CardContent className="min-w-96">
          {account.isConnected ? (
            <div className="">
              <InfoRow
                label="Connector"
                children={account.connector?.name}
                imageURL={rainbowkitIcon}
              />
              <InfoRow label="Wallet Type" children="Injected" />
              <InfoRow
                label="Address"
                children={`${account.address?.substring(
                  0,
                  6,
                )}...${account.address?.substring(
                  account.address?.length - 4,
                )}`}
              />
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
      )}
    </Card>
  );
}
