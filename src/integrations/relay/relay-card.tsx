import { AaveDepositRelay } from './aave-deposit-relay';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function RelayCard() {
  return (
    <Card className="h-fill w-full max-w-md">
      <CardHeader>
        <CardTitle>Relay Cross-Chain AAVE Deposit</CardTitle>
        <CardDescription>
          Supply USDC to AAVE on Base by sourcing WETH from Arbitrum
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AaveDepositRelay />
      </CardContent>
    </Card>
  );
}
