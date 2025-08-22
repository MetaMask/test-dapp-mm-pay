import { ExternalLinkIcon } from 'lucide-react';
import { parseUnits } from 'viem';
import { base } from 'viem/chains';

import { useBiconomyCrossChainSwap } from './use-biconomy-cross-chain-swap';

import { InfoRow } from '@/components/info-row';
import { Status } from '@/components/status';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { COMMON_TOKENS } from '@/constants/tokens';
import { getTokenLogo } from '@/lib/uniswap';
import { trimNumber } from '@/lib/utils';

const SOURCE_TOKEN = COMMON_TOKENS[base.id]?.USDC ?? null;
const DESTINATION_TOKEN = COMMON_TOKENS[base.id]?.WETH ?? null;
const DESTINATION_CHAIN_ID = base.id;
const AMOUNT_IN_DECIMAL = '0.65';
const AMOUNT = parseUnits(AMOUNT_IN_DECIMAL, 6);

export function BiconomyEoaSwapBasic() {
  const biconomySwap = useBiconomyCrossChainSwap({
    fromToken: SOURCE_TOKEN,
    toToken: DESTINATION_TOKEN,
    amount: AMOUNT,
    chainId: DESTINATION_CHAIN_ID,
  });

  const feeTokenLogo = getTokenLogo(SOURCE_TOKEN, DESTINATION_CHAIN_ID);
  console.log({ biconomySwap });

  return (
    <div className="text-xs">
      <div className="rounded-lg">
        {biconomySwap.error && <div>{biconomySwap.error.message}</div>}
        <div className="space-y-3">
          <div>
            <h1>Quote</h1>
            <Separator />

            <InfoRow
              label="Amount in"
              imageURL={getTokenLogo(SOURCE_TOKEN, DESTINATION_CHAIN_ID)}
            >
              {AMOUNT_IN_DECIMAL}
            </InfoRow>
            <InfoRow
              label="Amount out"
              imageURL={getTokenLogo(DESTINATION_TOKEN, DESTINATION_CHAIN_ID)}
            >
              {trimNumber(biconomySwap.uniswap?.quote?.outputAmount ?? '0')}
            </InfoRow>
            <InfoRow label="Slippage">
              {biconomySwap.uniswap?.quote?.slippagePercent ?? '0'}%
            </InfoRow>
          </div>
          <div className="">
            <h1>Fees</h1>
            <Separator />
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
            <h1>Status</h1>
            <Separator />
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
              label="Tx Status"
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
