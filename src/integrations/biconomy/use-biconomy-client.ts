import {
  createMeeClient,
  getMEEVersion,
  MEEVersion,
  toMultichainNexusAccount,
} from '@biconomy/abstractjs';
import { useQuery } from '@tanstack/react-query';
import { http, type WalletClient } from 'viem';
import { useWalletClient } from 'wagmi';

import { CHAIN_CONFIGS } from '@/lib/wagmi';

const chainConfigurations = CHAIN_CONFIGS.map(({ chain, rpcUrl }) => ({
  chain,
  transport: http(rpcUrl),
  version: getMEEVersion(MEEVersion.V2_1_0),
}));

async function getMeeClient(walletClient: WalletClient) {
  const orchestrator = await toMultichainNexusAccount({
    chainConfigurations,
    // @ts-expect-error - incorrectly typed, signer works
    signer: walletClient,
  });

  const meeClient = await createMeeClient({
    account: orchestrator,
    apiKey: import.meta.env.VITE_BICONOMY_MEE_KEY,
  });

  return {
    orchestrator,
    meeClient,
  };
}

export function useBiconomyClient() {
  const { data: walletClient } = useWalletClient();

  const { data: biconomyClient, error } = useQuery({
    queryKey: ['biconomy-mee', walletClient?.account.address],
    enabled: Boolean(walletClient),
    staleTime: Infinity,
    queryFn: async () => {
      if (!walletClient) {
        throw new Error('Wallet client not found');
      }

      console.debug('Creating a Biconomy client');

      const { orchestrator, meeClient } = await getMeeClient(walletClient);

      console.debug('Biconomy client created', orchestrator, meeClient);

      return { orchestrator, meeClient };
    },
  });

  return {
    ...biconomyClient,
    error,
  };
}
