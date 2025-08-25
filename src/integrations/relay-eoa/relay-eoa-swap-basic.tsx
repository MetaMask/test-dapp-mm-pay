import { parseUnits } from 'viem';
import { arbitrum, base } from 'viem/chains';

import { useRelayCrossChainSwap } from './use-relay-cross-chain-swap';

import { InfoRow } from '@/components/info-row';
import { Status } from '@/components/status';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { COMMON_TOKENS } from '@/constants/tokens';
import { getTokenLogo } from '@/lib/uniswap';
import { trimNumber } from '@/lib/utils';

const SOURCE_CHAIN_ID = arbitrum.id;
const DESTINATION_CHAIN_ID = base.id;
const SOURCE_TOKEN = COMMON_TOKENS[SOURCE_CHAIN_ID]?.USDC ?? null;
const DESTINATION_TOKEN = COMMON_TOKENS[DESTINATION_CHAIN_ID]?.WETH ?? null;
const AMOUNT = parseUnits('0.65', 6);

export function RelayEoaSwapBasic() {
  const relaySwap = useRelayCrossChainSwap({
    sourceChainId: SOURCE_CHAIN_ID,
    destinationChainId: DESTINATION_CHAIN_ID,
    fromToken: SOURCE_TOKEN,
    toToken: DESTINATION_TOKEN,
    amount: AMOUNT.toString(),
    chainId: DESTINATION_CHAIN_ID,
  });

  return (
    <div className="text-xs">
      <div className="rounded-lg">
        {relaySwap.quote.error && (
          <div className="text-xs text-red-500">
            {relaySwap.quote.error.message}
          </div>
        )}
        <div className="">
          <div className="mt-4 space-y-2">
            {/* <div>
              <h1>Current Steps</h1>
              <Separator />
              {relaySwap.quote.data?.steps?.map((step) => (
                <div key={step.id} className="font-bold">
                  <h2>{step.action}</h2>
                  <p>{step.description}</p>
                </div>
              ))}
            </div> */}
            <div>
              <h1>Quote</h1>
              <Separator />
              <InfoRow label="Rate">
                {trimNumber(relaySwap.quote.data?.details?.rate ?? '0')}
              </InfoRow>
              <InfoRow label="Amount in" imageURL={getTokenLogo(SOURCE_TOKEN)}>
                {relaySwap.quote.data?.details?.currencyIn?.amountFormatted}
              </InfoRow>
              <InfoRow
                label="Amount out"
                imageURL={getTokenLogo(DESTINATION_TOKEN)}
              >
                {trimNumber(
                  relaySwap.quote.data?.details?.currencyOut?.amountFormatted ??
                    '0',
                )}
              </InfoRow>
              <InfoRow label="Slippage">
                {
                  relaySwap.quote.data?.details?.slippageTolerance?.destination
                    ?.percent
                }
                %
              </InfoRow>
              <InfoRow label="Price Impact">
                {relaySwap.quote.data?.details?.swapImpact?.percent}%
              </InfoRow>
            </div>
            <div>
              <h1>Fees</h1>
              <Separator />
              <InfoRow label="Gas Fee">
                ${relaySwap.quote.data?.fees?.gas?.amountUsd?.substring(0, 5)}
              </InfoRow>
              <InfoRow label="Relay Fee">
                $
                {relaySwap.quote.data?.fees?.relayer?.amountUsd?.substring(
                  0,
                  5,
                )}
              </InfoRow>
            </div>

            <div>
              <h1>Status</h1>
              <Separator />
              <Status
                isLoading={relaySwap.quote.isLoading}
                isSuccess={relaySwap.quote.isSuccess}
                error={relaySwap.quote.error}
                label="Relay Quote"
              />
              <Status
                isLoading={false}
                isSuccess={false}
                error={false}
                label="Tx Status"
              />
            </div>

            {/* <
            <Status
              isLoading={relaySwap.fusionQuoteQuery.isLoading}
              isSuccess={relaySwap.fusionQuoteQuery.isSuccess}
              error={relaySwap.error}
              label="Biconomy Quote"
            />
            <Status
              isLoading={relaySwap.swapQuery.isPending}
              isSuccess={relaySwap.swapQuery.isSuccess}
              error={relaySwap.swapQuery.error}
              label="User Confirmation"
            />
            <Status
              isLoading={relaySwap.txQuery.isLoading}
              isSuccess={relaySwap.txQuery.isSuccess}
              error={relaySwap.txQuery.error}
              label="Tx Mined"
            /> */}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-y-2 space-y-4">
          <Button
            className="w-full"
            disabled={!relaySwap.quote.isSuccess}
            onClick={() => {
              relaySwap.handleSwap?.();
            }}
          >
            {relaySwap.quote.isSuccess ? 'Swap' : 'Waiting for quote...'}
          </Button>
        </div>
      </div>
    </div>
  );
}
