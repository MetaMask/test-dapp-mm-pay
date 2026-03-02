import { useMemo } from 'react';
import { type Address, toHex } from 'viem';
import { base } from 'viem/chains';
import {
  useAccount,
  useCallsStatus,
  useCapabilities,
  useSendCalls,
} from 'wagmi';

import { COMMON_TOKENS } from '@/constants/tokens';
import { encodeAaveSupplyCall } from '@/lib/aave';

const USDC_BASE = COMMON_TOKENS[base.id]?.USDC;

export function useAaveDepositMmPay({ amount }: { amount: bigint }) {
  const { address } = useAccount();

  const capabilities = useCapabilities({
    query: {
      enabled: Boolean(address),
    },
  });

  const isAuxiliaryFundsSupported = Boolean(
    capabilities.data?.[base.id]?.auxiliaryFunds?.supported,
  );

  const calls = useMemo(() => {
    if (!address || !USDC_BASE) return [];
    return encodeAaveSupplyCall({
      tokenAddress: USDC_BASE.address as Address,
      chainId: base.id,
      amount,
      recipientAddress: address,
    });
  }, [address, amount]);

  const sendCalls = useSendCalls();

  const callsStatus = useCallsStatus({
    id: sendCalls.data?.id ?? '',
    query: {
      enabled: Boolean(sendCalls.data?.id),
      refetchInterval: (query) => {
        const statusCode = query.state.data?.statusCode;
        if (statusCode !== undefined && statusCode >= 200) return false;
        return 1000;
      },
    },
  });

  const handleSubmit = () => {
    if (!address || !USDC_BASE || calls.length === 0) return;

    sendCalls.sendCalls({
      calls: calls.map((call) => ({
        to: call.to as Address,
        data: call.data as `0x${string}`,
        value: BigInt(call.value),
      })),
      chainId: base.id,
      capabilities: {
        auxiliaryFunds: {
          optional: true,
          requiredAssets: [
            {
              address: USDC_BASE.address,
              amount: toHex(amount),
              standard: 'erc20' as const,
            },
          ],
        },
      },
    });
  };

  const error = capabilities.error || sendCalls.error || callsStatus.error;

  return {
    isAuxiliaryFundsSupported,
    capabilitiesLoading: capabilities.isLoading,
    capabilitiesError: capabilities.error,
    handleSubmit,
    sendCalls,
    callsStatus,
    error,
  };
}
