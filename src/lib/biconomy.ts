import type {
  MultichainContract,
  MultichainSmartAccount,
  BuildAcrossIntentComposableInstruction,
} from '@biconomy/abstractjs';
import { type erc20Abi } from 'viem';

import { ACROSS_ADDRESSES } from '@/constants/across';

type GetBridgeTransactionParams = {
  sourceChainId: number;
  destinationChainId: number;
  token: MultichainContract<typeof erc20Abi>;
  orchestrator: MultichainSmartAccount;
  amount: bigint;
};
export function getBridgeTransaction({
  sourceChainId,
  destinationChainId,
  token,
  orchestrator,
  amount,
}: GetBridgeTransactionParams): BuildAcrossIntentComposableInstruction {
  return {
    type: 'acrossIntent',
    data: {
      pool: ACROSS_ADDRESSES[sourceChainId],
      depositor: orchestrator.addressOn(sourceChainId)!,
      recipient: orchestrator.addressOn(destinationChainId)!,
      inputToken: token.addressOn(sourceChainId),
      outputToken: token.addressOn(destinationChainId),
      inputAmountRuntimeParams: {
        targetAddress: orchestrator.addressOn(sourceChainId)!,
        tokenAddress: token.addressOn(sourceChainId),
        constraints: [],
      },
      approximateExpectedInputAmount: amount,
      originChainId: sourceChainId,
      destinationChainId,
      message: '0x',
    },
  };
}
