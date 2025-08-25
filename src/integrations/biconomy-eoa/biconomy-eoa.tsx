import { AaveDepositBiconomyEoa } from './aave-deposit-biconomy-eoa';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function BiconomyEoa() {
  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Biconomy Cross-Chain AAVE Deposit</CardTitle>
          <CardDescription>
            Choose an WETH amount to swap for USDC and supply to AAVE on Base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AaveDepositBiconomyEoa />
        </CardContent>
      </Card>
    </div>
  );
}
