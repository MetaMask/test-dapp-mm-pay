import { AaveClient, AaveProvider as AaveProviderBase } from '@aave/react';

const client = AaveClient.create();

export function AaveProvider({ children }: { children: React.ReactNode }) {
  return <AaveProviderBase client={client}>{children}</AaveProviderBase>;
}
