import { useCallback, useEffect, useMemo, useState } from 'react';
import { numberToHex, toHex } from 'viem';
import { base } from 'viem/chains';
import { useAccount, useCapabilities, useConnectorClient } from 'wagmi';

import { COMMON_TOKENS } from '@/constants/tokens';
import { useLog } from '@/hooks/use-log';
import { encodeAaveSupplyCall } from '@/lib/aave';

const USDC_BASE = COMMON_TOKENS[base.id]?.USDC;
const BASE_CHAIN_ID_HEX = numberToHex(base.id);

type CallsStatusResponse = {
  version: string;
  id: string;
  chainId: string;
  status: number;
  atomic: boolean;
  receipts?: {
    logs: { address: string; data: string; topics: string[] }[];
    status: string;
    blockHash: string;
    blockNumber: string;
    gasUsed: string;
    transactionHash: string;
  }[];
};

export function useAaveDepositMmPay({ amount }: { amount: bigint }) {
  const { address } = useAccount();
  const { data: connectorClient } = useConnectorClient();

  const [sendCallsId, setSendCallsId] = useState<string | null>(null);
  const [sendCallsStatus, setSendCallsStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [callsStatus, setCallsStatus] = useState<CallsStatusResponse | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);
  const { log } = useLog();

  const capabilities = useCapabilities({
    query: {
      enabled: Boolean(address),
    },
  });

  const isAuxiliaryFundsSupported = Boolean(
    capabilities.data?.[base.id]?.auxiliaryFunds?.supported,
  );

  useEffect(() => {
    if (!capabilities.isLoading && capabilities.data !== undefined) {
      const supported = Boolean(
        capabilities.data?.[base.id]?.auxiliaryFunds?.supported,
      );
      log(
        `wallet_getCapabilities → auxiliaryFunds.supported: ${String(supported)}`,
      );
    }
  }, [capabilities.isLoading]); // intentionally omit `log` and `capabilities.data` to run only when loading state changes

  const calls = useMemo(() => {
    if (!address || !USDC_BASE) {
      return [];
    }
    return encodeAaveSupplyCall({
      tokenAddress: USDC_BASE.address,
      chainId: base.id,
      amount,
      recipientAddress: address,
    });
  }, [address, amount]);

  const pollCallsStatus = useCallback(
    async (id: string, provider: { request: (args: any) => Promise<any> }) => {
      let lastLoggedStatus: number | null = null;

      const poll = async () => {
        try {
          const result: CallsStatusResponse = await provider.request({
            method: 'wallet_getCallsStatus',
            params: [id],
          });
          setCallsStatus(result);

          if (result.status !== lastLoggedStatus) {
            lastLoggedStatus = result.status;
            const level = result.status >= 400 ? 'error' : 'log';
            log(`wallet_getCallsStatus → status: ${result.status}`, level);
          }

          if (result.status >= 200) {
            return;
          }
          setTimeout(() => {
            poll().catch(console.error);
          }, 1000);
        } catch (caughtError) {
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error('Failed to get call status'),
          );
          log(
            `wallet_getCallsStatus failed: ${caughtError instanceof Error ? caughtError.message : String(caughtError)}`,
            'error',
          );
        }
      };
      await poll();
    },
    [log],
  );

  const handleSubmit = useCallback(async () => {
    if (!address || !USDC_BASE || calls.length === 0 || !connectorClient) {
      return;
    }

    log('Submitting wallet_sendCalls...');
    setError(null);
    setSendCallsStatus('pending');
    setSendCallsId(null);
    setCallsStatus(null);

    try {
      const provider = await connectorClient.transport.getProvider?.();
      const target = provider ?? connectorClient.transport;

      const result = await target.request({
        method: 'wallet_sendCalls',
        params: [
          {
            version: '2.0.0',
            from: address,
            chainId: BASE_CHAIN_ID_HEX,
            atomicRequired: true,
            calls: calls.map((call) => ({
              to: call.to,
              data: call.data,
              value: toHex(BigInt(call.value)),
            })),
            capabilities: {
              auxiliaryFunds: {
                optional: false,
                requiredAssets: [
                  {
                    address: USDC_BASE.address,
                    amount: toHex(amount),
                    standard: 'erc20',
                  },
                ],
              },
            },
          },
        ],
      });

      const id =
        typeof result === 'string' ? result : (result as { id: string }).id;
      setSendCallsId(id);
      log(`wallet_sendCalls accepted — id: ${id}`);
      setSendCallsStatus('success');

      await pollCallsStatus(id, target);
    } catch (caughtError) {
      setSendCallsStatus('error');
      log(
        `wallet_sendCalls failed: ${caughtError instanceof Error ? caughtError.message : String(caughtError)}`,
        'error',
      );
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('wallet_sendCalls failed'),
      );
    }
  }, [address, calls, amount, connectorClient, pollCallsStatus, log]);

  return {
    isAuxiliaryFundsSupported,
    capabilitiesLoading: capabilities.isLoading,
    capabilitiesError: capabilities.error,
    handleSubmit,
    sendCallsId,
    sendCallsStatus,
    callsStatus,
    error,
  };
}
