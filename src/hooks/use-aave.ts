import { chainId, useUserSupplies } from '@aave/react';
import { useMemo } from 'react';
import { parseUnits, type Address } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { useTokenAllowance } from './use-token-allowance';

import { COMMON_TOKENS } from '@/constants/tokens';
import { getAavePoolV3Address, prepareAaveSupplyCall } from '@/lib/aave';

const CHAIN_ID = 8453;
const { USDC } = COMMON_TOKENS[CHAIN_ID] ?? {};
const AMOUNT_IN_DECIMAL = '0.1';
const AMOUNT_IN_WEI = parseUnits(AMOUNT_IN_DECIMAL, USDC?.decimals ?? 6);

export function useAave() {
  const { address } = useAccount();
  const AAVE_POOL_V3_ADDRESS = getAavePoolV3Address(CHAIN_ID);

  const allowance = useTokenAllowance(
    AAVE_POOL_V3_ADDRESS,
    USDC?.address as Address,
    AMOUNT_IN_WEI,
  );

  const { data: userSupplies, error: userSuppliesError } = useUserSupplies({
    markets: [{ chainId: chainId(CHAIN_ID), address: AAVE_POOL_V3_ADDRESS }],
    user: address,
  });

  const supplyCall = useWriteContract();
  const supplyReceipt = useWaitForTransactionReceipt({ hash: supplyCall.data });

  const handleSupply = () => {
    supplyCall.writeContract(
      prepareAaveSupplyCall({
        tokenAddress: USDC?.address as Address,
        chainId: CHAIN_ID,
        amount: AMOUNT_IN_WEI,
        recipientAddress: address as Address,
      }),
    );
  };

  const error = allowance.error ?? userSuppliesError;

  const position = useMemo(() => {
    const data = userSupplies?.[0];
    if (!data) {
      return {
        apy: '0',
        balance: '0',
      };
    }
    const apy = data.apy.formatted as string;
    const balance = data.balance.amount.value as string;

    return {
      balance,
      apy,
    };
  }, [userSupplies]);

  return {
    userSupplies,
    position,
    handleSupply,
    supplyReceipt,
    allowance,
    error,
  };
}
