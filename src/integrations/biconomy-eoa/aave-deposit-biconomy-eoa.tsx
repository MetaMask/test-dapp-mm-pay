import { ExternalLinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { arbitrum, base } from 'viem/chains';

import { useAaveDepositBiconomy } from './use-aave-deposit-biconomy';

import { ErrorContainer } from '@/components/error-container';
import { InfoRow } from '@/components/info-row';
import { Status } from '@/components/status';
import { TokenInput } from '@/components/token-input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AUSDC_BASE, COMMON_TOKENS } from '@/constants/tokens';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { getTokensByChain } from '@/lib/tokens';
import { getTokenLogo } from '@/lib/uniswap';
import { trimNumber } from '@/lib/utils';
import type { Token } from '@/types/swap';

const DESTINATION_TOKEN = COMMON_TOKENS[base.id]?.USDC ?? null;
const DESTINATION_CHAIN_ID = base.id;
const AMOUNT_IN_DECIMAL = '0.0002';

// hardcoded to Arbitrum for now
const sourceTokens = getTokensByChain(arbitrum.id).filter(
  ({ symbol }) => symbol === 'WETH',
);

const SOURCE_TOKEN = sourceTokens.find(
  (token) => token.symbol === 'WETH',
) as Token;

export function AaveDepositBiconomyEoa() {
  const [token, setToken] = useState<Token>(SOURCE_TOKEN);
  const [amount, setAmount] = useState<string>(AMOUNT_IN_DECIMAL);
  const balance = useTokenBalance(token);
  const ausdcBalance = useTokenBalance(AUSDC_BASE);

  const biconomySwap = useAaveDepositBiconomy({
    fromToken: SOURCE_TOKEN,
    toToken: DESTINATION_TOKEN,
    amount: parseUnits(amount, SOURCE_TOKEN.decimals),
    chainId: DESTINATION_CHAIN_ID,
  });

  useEffect(() => {
    if (biconomySwap.txQuery.isSuccess) {
      balance.refetch().catch(console.log);
      ausdcBalance.refetch().catch(console.log);
    }
  });

  return (
    <div className="text-xs">
      <div className="rounded-lg">
        {biconomySwap.error && <ErrorContainer error={biconomySwap.error} />}
        <div className="space-y-3">
          <TokenInput
            balance={balance.balanceDecimal}
            tokens={sourceTokens}
            amount={amount}
            selectedToken={token}
            onTokenSelect={setToken}
            onAmountChange={setAmount}
            onMaxAmount={() => setAmount(token?.balance ?? '0')}
          />
          <div>
            <InfoRow label="aUSDC Balance" imageURL={AUSDC_BASE.logoURI}>
              {ausdcBalance.balanceDecimal}
            </InfoRow>
          </div>
          <div>
            <h1>Swap Quote</h1>
            <Separator />

            <InfoRow label="Amount in" imageURL={getTokenLogo(SOURCE_TOKEN)}>
              {amount}
            </InfoRow>
            <InfoRow
              label="Amount out"
              imageURL={getTokenLogo(DESTINATION_TOKEN)}
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
            <InfoRow label="Gas Fee">
              {trimNumber(
                // @ts-expect-error - missing type
                biconomySwap.fusionQuote?.quote.paymentInfo.gasFee,
              )}
            </InfoRow>

            <InfoRow label="Orchestration Fee">
              {trimNumber(
                // @ts-expect-error - missing type
                biconomySwap.fusionQuote?.quote.paymentInfo.orchestrationFee,
              )}
            </InfoRow>
          </div>
          <div className="mt-4">
            <h1>Status</h1>
            <Separator />
            <Status
              isLoading={!biconomySwap.uniswap.isQuoteReady}
              isSuccess={biconomySwap.uniswap.isQuoteReady}
              error={biconomySwap.uniswap.error}
              label="Swap Quote"
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
