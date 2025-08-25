import type { RuntimeValue } from '@biconomy/abstractjs';
import type { Address } from 'viem';

import { AAVE_POOL_V3_ABI } from '@/abis/aave-pool-v3';
import { getAavePoolV3Address } from '@/constants/aave';

/**
 * Prepares a call to the Aave Pool V3 contract to supply an asset
 * @param configuration - The address of the token to supply
 * @param configuration.chainId - The chain ID of the network
 * @param configuration.amount - The amount of the token to supply in wei
 * @param configuration.recipientAddress - The address of the recipient
 * @param configuration.tokenAddress - The address of the token to supply
 * @returns A call configuration for the Aave Pool V3 contract to supply an asset
 */
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
    functionName: 'supply' as const,
    args: [tokenAddress, amount as bigint, recipientAddress, 0] as const,
  };
}
