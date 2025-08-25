import { InfoRow } from './info-row';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { AUSDC_BASE } from '@/constants/tokens';
import { useAave } from '@/hooks/use-aave';
import { useAaveWithdraw } from '@/hooks/use-aave-withdraw';
import { trimNumber } from '@/lib/utils';

export function AaveAccountStatus() {
  const { position, allowance, handleSupply } = useAave();
  const { execute } = useAaveWithdraw();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <img src="src/assets/aave.svg" alt="Aave" className="size-6" />
          AAVE Account Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs">
          <InfoRow label="aUSDC Balance" imageURL={AUSDC_BASE.logoURI}>
            {trimNumber(position.balance)}
          </InfoRow>
          <InfoRow label="APY">{position.apy}%</InfoRow>

          <div className="mt-4 flex gap-x-3">
            <Button
              disabled={!allowance.approveCallSimulation.isSuccess}
              onClick={() => {
                allowance.approve();
              }}
            >
              Approve
            </Button>
            <Button
              onClick={() => {
                handleSupply();
              }}
            >
              Supply
            </Button>
            <Button
              onClick={() => {
                execute().catch(console.error);
              }}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
