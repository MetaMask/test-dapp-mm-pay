import { encodeFunctionData, erc20Abi, type Address } from 'viem';

import { AAVE_POOL_V3_ABI } from '@/abis/aave-pool-v3';
import { AAVE_POOL_V3_ADDRESS } from '@/constants/aave';

type AaveSupplyParams = {
  tokenAddress: Address;
  recipientAddress: Address;
  chainId: number;
  amount: bigint;
};

export function encodeAaveSupplyCall({
  tokenAddress,
  chainId,
  amount,
  recipientAddress,
}: AaveSupplyParams) {
  const contractAddress = AAVE_POOL_V3_ADDRESS[chainId];
  if (!contractAddress) {
    throw new Error(`Aave pool v3 address not found for chainId: ${chainId}`);
  }
  const args = [tokenAddress, amount, recipientAddress, 0] as const;

  if (!tokenAddress || !recipientAddress) {
    return [];
  }

  const approvalArgs = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [contractAddress, amount],
  });

  const approvalCall = {
    data: approvalArgs,
    to: tokenAddress,
    chainId,
    value: '0',
  };

  const supplyArgs = encodeFunctionData({
    abi: AAVE_POOL_V3_ABI,
    functionName: 'supply',
    args,
  });

  const supplyCall = {
    data: supplyArgs,
    to: contractAddress,
    chainId,
    value: '0',
  };

  return [approvalCall, supplyCall];
}
