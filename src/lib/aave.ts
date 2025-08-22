import type { Address } from 'viem';

import { AAVE_POOL_V3_ABI } from '@/abis/aave-pool-v3';
import { getAavePoolV3Address } from '@/constants/aave';
import { RuntimeValue } from '@biconomy/abstractjs';

export function prepareAaveSupplyCall({
  tokenAddress,
  chainId,
  amount,
  recipientAddress,
}: {
  tokenAddress: Address;
  chainId: number;
  amount: bigint | RuntimeValue;
  recipientAddress: Address;
}) {
  const contractAddress = getAavePoolV3Address(chainId);

  return {
    address: contractAddress,
    abi: AAVE_POOL_V3_ABI,
    functionName: 'supply',
    args: [tokenAddress, amount, recipientAddress, 0],
  };
}
