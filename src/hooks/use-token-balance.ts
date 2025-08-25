import type { Address } from 'viem';
import { erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { trimNumber } from '@/lib/utils';
import type { Token } from '@/types/swap';

export function useTokenBalance(
  token: Pick<Token, 'address' | 'chainId' | 'decimals'> | null,
  address?: Address,
) {
  const { address: connectedAddress } = useAccount();

  const addressToUse = address ?? connectedAddress;

  const { data: balance, ...balanceQuery } = useReadContract({
    chainId: token?.chainId,
    address: token?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [addressToUse!],
    query: {
      enabled: Boolean(addressToUse),
    },
  });

  return {
    balance,
    balanceDecimal: balance
      ? trimNumber(formatUnits(balance, token!.decimals))
      : '0',
    ...balanceQuery,
  };
}
