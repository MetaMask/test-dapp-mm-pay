import { useCallback, useEffect, useMemo } from 'react';
import { erc20Abi, type Address } from 'viem';
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

export function useTokenAllowance(
  spenderAddress: Address,
  tokenAddress: Address,
  amount: bigint,
) {
  const { address: account } = useAccount();

  const hasRequiredParams = Boolean(
    spenderAddress && tokenAddress && amount && account,
  );

  const { data: currentAllowance, ...allowanceCall } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account as Address, spenderAddress],
    query: { enabled: hasRequiredParams },
  });

  const { data: hash, ...approveCall } = useWriteContract();

  const approveReceipt = useWaitForTransactionReceipt({ hash });

  const hasAllowance = useMemo(() => {
    if (!currentAllowance) {
      return false;
    }
    return currentAllowance >= amount;
  }, [currentAllowance, amount, approveReceipt.isSuccess]);

  const approveCallSimulation = useSimulateContract({
    account,
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spenderAddress, amount],
    query: { enabled: hasRequiredParams && !hasAllowance },
  });

  const approve = useCallback(() => {
    if (
      approveCallSimulation.isSuccess &&
      approveCallSimulation.data?.request
    ) {
      approveCall.writeContract(approveCallSimulation.data.request);
    }
  }, [
    approveCall,
    approveCallSimulation.isSuccess,
    approveCallSimulation.data?.request,
  ]);

  // Refetch allowance after approve tx succeeds
  useEffect(() => {
    if (approveReceipt.isSuccess) {
      allowanceCall.refetch().catch(console.error);
    }
  }, [approveReceipt.isSuccess, allowanceCall]);

  const isApproving = approveCall.isPending || approveReceipt.isLoading;
  const error = approveReceipt.error ?? approveCall.error;

  return {
    allowance: allowanceCall,
    receipt: approveReceipt,
    approveCallSimulation,
    approve,
    hasAllowance,
    isApproving,
    error,
  };
}
