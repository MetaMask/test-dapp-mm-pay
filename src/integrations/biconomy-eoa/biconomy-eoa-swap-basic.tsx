import { ExternalLinkIcon } from 'lucide-react';
import { parseUnits } from 'viem';
import { base } from 'viem/chains';

import { useBiconomyCrossChainSwap } from './use-biconomy-cross-chain-swap';

import { Status } from '@/components/status';
import { Button } from '@/components/ui/button';
import { COMMON_TOKENS } from '@/constants/tokens';
import { getTokenLogo } from '@/lib/uniswap';
import { trimNumber } from '@/lib/utils';

const SOURCE_TOKEN = COMMON_TOKENS[base.id]?.USDC ?? null;
const DESTINATION_TOKEN = COMMON_TOKENS[base.id]?.WETH ?? null;
const DESTINATION_CHAIN_ID = base.id;
const AMOUNT = parseUnits('0.65', 6);

export function BiconomyEoaSwapBasic() {
  const biconomySwap = useBiconomyCrossChainSwap({
    fromToken: SOURCE_TOKEN,
    toToken: DESTINATION_TOKEN,
    amount: AMOUNT,
    chainId: DESTINATION_CHAIN_ID,
  });

  const feeTokenLogo = getTokenLogo(SOURCE_TOKEN, DESTINATION_CHAIN_ID);

  return (
    <div className="text-xs">
      <div className="rounded-lg">
        {biconomySwap.error && <div>{biconomySwap.error.message}</div>}
        <div className="">
          <div className="">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gas Fee</span>
              <span className={'flex items-center gap-x-1'}>
                {/* @ts-expect-error - incorrectly typed, value exists */}
                {trimNumber(biconomySwap.fusionQuote?.quote.paymentInfo.gasFee)}
                <img src={feeTokenLogo} className="h-4 w-4" />
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Orchestration Fee</span>

              <span className={'flex items-center gap-x-1'}>
                {trimNumber(
                  // @ts-expect-error - incorrectly typed, value exists
                  biconomySwap.fusionQuote?.quote.paymentInfo.orchestrationFee,
                )}
                <img src={feeTokenLogo} className="h-4 w-4" />
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Status
              isLoading={!biconomySwap.uniswap.isQuoteReady}
              isSuccess={biconomySwap.uniswap.isQuoteReady}
              error={biconomySwap.uniswap.error}
              label="Uni Quote"
            />
            <Status
              isLoading={biconomySwap.fusionQuoteQuery.isLoading}
              isSuccess={biconomySwap.fusionQuoteQuery.isSuccess}
              error={biconomySwap.error}
              label="Biconomy Quote"
            />
            <Status
              isLoading={biconomySwap.swapQuery.isPending}
              isSuccess={biconomySwap.swapQuery.isSuccess}
              error={biconomySwap.swapQuery.error}
              label="User Confirmation"
            />
            <Status
              isLoading={biconomySwap.txQuery.isLoading}
              isSuccess={biconomySwap.txQuery.isSuccess}
              error={biconomySwap.txQuery.error}
              label="Tx Mined"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-y-2 space-y-4">
          <Button
            disabled={!biconomySwap.fusionQuoteQuery.isSuccess}
            className="w-full"
            onClick={() => biconomySwap.execute()}
          >
            {biconomySwap.fusionQuoteQuery.isSuccess
              ? 'Swap'
              : 'Waiting for quote...'}
          </Button>
          {biconomySwap.meeScanLink && (
            <Button variant="outline" className="w-full">
              <a
                href={biconomySwap.meeScanLink}
                target="_blank"
                className="flex gap-x-2 text-xs text-blue-500"
              >
                View status on MEEScan
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
