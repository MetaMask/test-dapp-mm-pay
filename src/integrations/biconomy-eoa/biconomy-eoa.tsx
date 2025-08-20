import { BiconomyEoaSwapBasic } from './biconomy-eoa-swap-basic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BiconomyEoa() {
  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Biconomy EOA Cross-Chain Swap</CardTitle>
        </CardHeader>
        <CardContent>
          <BiconomyEoaSwapBasic />
        </CardContent>
      </Card>
    </div>
  );
}
