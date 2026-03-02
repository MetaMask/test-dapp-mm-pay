import { useAccount } from 'wagmi';

import { AaveDepositBiconomyEoa } from './biconomy/aave-deposit-biconomy';
import { AaveDepositMmPay } from './mmpay/aave-deposit-mmpay';
import { AaveDepositRelay } from './relay/aave-deposit-relay';

export function ActionCards() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex gap-x-4">
      <AaveDepositRelay />
      <AaveDepositBiconomyEoa />
      <AaveDepositMmPay />
    </div>
  );
}
