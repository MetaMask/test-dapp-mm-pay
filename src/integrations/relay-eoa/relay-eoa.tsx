import { AaveDepositRelayEoa } from './aave-deposit-relay-eoa';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function RelayEoa() {
  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Relay Cross-Chain AAVE Deposit</CardTitle>
          <CardDescription>
            Supply USDC to AAVE on Base by sourcing WETH from Arbitrum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AaveDepositRelayEoa />
        </CardContent>
      </Card>
    </div>
  );
}
