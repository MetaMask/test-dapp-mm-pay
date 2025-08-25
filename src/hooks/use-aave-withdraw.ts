import { errAsync, evmAddress, useWithdraw } from '@aave/react';
import { useSendTransaction } from '@aave/react/viem';
import { useCallback } from 'react';
import { base } from 'viem/chains';
import { useWalletClient } from 'wagmi';

import { getAavePoolV3Address } from '@/constants/aave';
import { COMMON_TOKENS } from '@/constants/tokens';

const chainId = base.id;
const { USDC: USDC_BASE } = COMMON_TOKENS[base.id]!;

export function useAaveWithdraw() {
  const { data: walletClient } = useWalletClient();

  const [withdraw, withdrawing] = useWithdraw();
  const [sendTransaction] = useSendTransaction(walletClient);

  const execute = useCallback(async () => {
    await withdraw({
      market: getAavePoolV3Address(chainId),
      amount: {
        erc20: {
          currency: USDC_BASE!.address,
          value: {
            max: true,
          },
        },
      },
      sender: evmAddress(walletClient!.account.address),
      chainId,
    }).andThen((plan) => {
      switch (plan.__typename) {
        case 'TransactionRequest':
          // Single transaction execution
          return sendTransaction(plan);

        case 'ApprovalRequired':
          // Approval + transaction sequence
          return sendTransaction(plan.approval).andThen(() =>
            sendTransaction(plan.originalTransaction),
          );

        case 'InsufficientBalanceError':
          return errAsync(new Error(`Insufficient balance: ${0} required.`));

        default:
          return errAsync(new Error('Unknown error'));
      }
    });
  }, [withdraw, walletClient]);

  return {
    withdraw,
    withdrawing,
    execute,
  };
}
