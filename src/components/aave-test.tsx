import { InfoRow } from './info-row';
import { Status } from './status';
import { Button } from './ui/button';

import { useAave } from '@/hooks/use-aave';

export function AaveTest() {
  const { position, allowance, handleSupply, ...aave } = useAave();

  return (
    <div className="text-xs">
      <InfoRow label="Error">
        <div>{JSON.stringify(allowance.error)}</div>
      </InfoRow>
      <InfoRow label="aUSDC Balance">{position.balance}</InfoRow>
      <InfoRow label="APY">{position.apy}%</InfoRow>

      <div>
        <InfoRow label="Enough Allowance">
          <div>{JSON.stringify(allowance.hasAllowance)}</div>
        </InfoRow>
      </div>

      <Status {...aave.supplyReceipt} label="Supply" />
      <Button
        onClick={() => {
          handleSupply();
        }}
      >
        Approve
      </Button>
    </div>
  );
}
