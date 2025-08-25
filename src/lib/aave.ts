import type { RuntimeValue } from '@biconomy/abstractjs';
import { encodeFunctionData, erc20Abi, type Address } from 'viem';

import { AAVE_POOL_V3_ABI } from '@/abis/aave-pool-v3';
import { getAavePoolV3Address } from '@/constants/aave';

type AaveSupplyParams = {
  tokenAddress: Address;
  recipientAddress: Address;
  chainId: number;
  amount: bigint;
};

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
  amount: bigint | RuntimeValue;
} & Omit<AaveSupplyParams, 'amount'>) {
  const contractAddress = getAavePoolV3Address(chainId);
  const args = [tokenAddress, amount as bigint, recipientAddress, 0] as const;

  return {
    address: contractAddress,
    abi: AAVE_POOL_V3_ABI,
    functionName: 'supply' as const,
    chainId,
    args,
  };
}

/**
 * Prepares a call to the Aave Pool V3 contract to supply an asset
 * @param configuration - The address of the token to supply
 * @param configuration.chainId - The chain ID of the network
 * @param configuration.amount - The amount of the token to supply in wei
 * @param configuration.recipientAddress - The address of the recipient
 * @param configuration.tokenAddress - The address of the token to supply
 * @returns A call configuration for the Aave Pool V3 contract to supply an asset
 */
export function encodeAaveSupplyCall({
  tokenAddress,
  chainId,
  amount,
  recipientAddress,
}: AaveSupplyParams) {
  const contractAddress = getAavePoolV3Address(chainId);
  const args = [tokenAddress, amount, recipientAddress, 0] as const;

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
