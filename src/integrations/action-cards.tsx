import { useAccount } from 'wagmi';

import { BiconomyCard } from './biconomy/biconomy-card';
import { RelayCard } from './relay/relay-card';

export function ActionCards() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex gap-x-4">
      <BiconomyCard />
      <RelayCard />
    </div>
  );
}
