import { useState } from 'react';
import { parseUnits } from 'viem';
import { arbitrum, base } from 'viem/chains';

import { useAaveDepositRelay } from './use-aave-deposit-relay';

import { ErrorContainer } from '@/components/error-container';
import { InfoRow } from '@/components/info-row';
import { Status } from '@/components/status';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AUSDC_BASE, COMMON_TOKENS } from '@/constants/tokens';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { getTokenLogo } from '@/lib/uniswap';
import { trimNumber } from '@/lib/utils';

const SOURCE_CHAIN_ID = arbitrum.id;
const DESTINATION_CHAIN_ID = base.id;
const SOURCE_TOKEN = COMMON_TOKENS[SOURCE_CHAIN_ID]?.WETH ?? null;
const DESTINATION_TOKEN = COMMON_TOKENS[DESTINATION_CHAIN_ID]?.USDC ?? null;

export function AaveDepositRelayEoa() {
  const [amount, setAmount] = useState<string>('1');
  const sourceBalance = useTokenBalance(SOURCE_TOKEN);
  const destinationBalance = useTokenBalance(AUSDC_BASE);

  const operation = useAaveDepositRelay({
    sourceChainId: SOURCE_CHAIN_ID,
    destinationChainId: DESTINATION_CHAIN_ID,
    fromToken: SOURCE_TOKEN,
    toToken: DESTINATION_TOKEN,
    amount: parseUnits(amount, DESTINATION_TOKEN?.decimals ?? 18),
    chainId: DESTINATION_CHAIN_ID,
  });

  return (
    <div className="text-xs">
      <div className="rounded-lg">
        {operation.quote.error && (
          <ErrorContainer error={operation.quote.error} />
        )}
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <img
              className="size-6 rounded-full"
              src={getTokenLogo(DESTINATION_TOKEN)}
              alt="Source Token"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="amount">
              {DESTINATION_TOKEN?.symbol} amount to supply
            </Label>
            <Input
              className="w-full"
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
        </div>
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
              <h1>Balances</h1>
              <Separator />
              <InfoRow
                label="WETH Balance"
                imageURL={getTokenLogo(SOURCE_TOKEN)}
              >
                {sourceBalance.balanceDecimal}
              </InfoRow>
              <InfoRow label="aUSDC Balance" imageURL={AUSDC_BASE.logoURI}>
                {destinationBalance.balanceDecimal}
              </InfoRow>
            </div>
            <div>
              <h1>Quote</h1>
              <Separator />

              <InfoRow label="Amount in" imageURL={getTokenLogo(SOURCE_TOKEN)}>
                {trimNumber(
                  operation.quote.data?.details?.currencyIn?.amountFormatted ??
                    '0',
                )}
              </InfoRow>
              <InfoRow
                label="Amount out"
                imageURL={getTokenLogo(DESTINATION_TOKEN)}
              >
                {trimNumber(
                  operation.quote.data?.details?.currencyOut?.amountFormatted ??
                    '0',
                )}
              </InfoRow>
              <InfoRow label="Slippage">
                {
                  operation.quote.data?.details?.slippageTolerance?.destination
                    ?.percent
                }
                %
              </InfoRow>
            </div>
            <div>
              <h1>Fees</h1>
              <Separator />
              <InfoRow label="Gas Fee">
                ${operation.quote.data?.fees?.gas?.amountUsd?.substring(0, 5)}
              </InfoRow>
              <InfoRow label="Relay Fee">
                $
                {operation.quote.data?.fees?.relayer?.amountUsd?.substring(
                  0,
                  5,
                )}
              </InfoRow>
            </div>

            <div>
              <h1>Status</h1>
              <Separator />
              <Status
                isLoading={operation.quote.isLoading}
                isSuccess={operation.quote.isSuccess}
                error={operation.quote.error}
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
            disabled={!operation.quote.isSuccess}
            onClick={() => {
              operation.handleSwap?.();
            }}
          >
            {operation.quote.isSuccess ? 'Swap' : 'Waiting for quote...'}
          </Button>
        </div>
      </div>
    </div>
  );
}
