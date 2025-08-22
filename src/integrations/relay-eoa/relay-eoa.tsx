import { RelayEoaSwapBasic } from './relay-eoa-swap-basic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RelayEoa() {
  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Relay EOA Cross-Chain Swap</CardTitle>
        </CardHeader>
        <CardContent>
          <RelayEoaSwapBasic />
        </CardContent>
      </Card>
    </div>
  );
}
