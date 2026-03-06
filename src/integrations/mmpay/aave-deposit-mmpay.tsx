import { useState } from 'react';
import { parseUnits } from 'viem';
import { base } from 'viem/chains';

import { useAaveDepositMmPay } from './use-aave-deposit-mmpay';

import { InfoRow } from '@/components/info-row';
import { Status } from '@/components/status';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AUSDC_BASE, COMMON_TOKENS } from '@/constants/tokens';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { getTokenLogo } from '@/lib/uniswap';

const DESTINATION_TOKEN = COMMON_TOKENS[base.id]?.USDC ?? null;

function getButtonLabel(operation: ReturnType<typeof useAaveDepositMmPay>) {
  if (!operation.isAuxiliaryFundsSupported && !operation.capabilitiesLoading) {
    return 'auxiliaryFunds not supported';
  }
  if (operation.sendCallsStatus === 'pending') {
    return 'Confirming...';
  }
  return 'Supply via MetaMask Pay';
}

export function AaveDepositMmPay() {
  const [amount, setAmount] = useState<string>('1');

  const amountInWei = parseUnits(
    amount || '0',
    DESTINATION_TOKEN?.decimals ?? 6,
  );

  const operation = useAaveDepositMmPay({ amount: amountInWei });

  const usdcBalance = useTokenBalance(DESTINATION_TOKEN);
  const aUsdcBalance = useTokenBalance(AUSDC_BASE);

  const isConfirmed = operation.callsStatus?.status === 200;
  const isFailed =
    operation.callsStatus?.status !== undefined &&
    operation.callsStatus.status >= 400;
  const isPending =
    operation.callsStatus?.status !== undefined &&
    operation.callsStatus.status < 200;

  const disableSubmit =
    !operation.isAuxiliaryFundsSupported ||
    !amount ||
    amountInWei === 0n ||
    operation.sendCallsStatus === 'pending';

  return (
    <Card className="h-fill flex w-full max-w-md flex-col justify-between text-xs">
      <CardHeader>
        <CardTitle>MetaMask Pay (EIP-5792)</CardTitle>
        <CardDescription>
          Supply USDC to AAVE on Base via wallet-managed funding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <img
              className="size-6 rounded-full"
              src={getTokenLogo(DESTINATION_TOKEN)}
              alt="USDC"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="mmpay-amount">
              {DESTINATION_TOKEN?.symbol} amount to supply
            </Label>
            <Input
              className="w-full"
              id="mmpay-amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
        </div>
        <div className="">
          <div className="mt-4 space-y-2">
            <div>
              <h1>Balances</h1>
              <Separator />
              <InfoRow
                label="USDC Balance"
                imageURL={getTokenLogo(DESTINATION_TOKEN)}
              >
                {usdcBalance.balanceDecimal}
              </InfoRow>
              <InfoRow label="aUSDC Balance" imageURL={AUSDC_BASE.logoURI}>
                {aUsdcBalance.balanceDecimal}
              </InfoRow>
            </div>

            <div>
              <h1>Status</h1>
              <Separator />
              <Status
                isLoading={operation.capabilitiesLoading}
                isSuccess={operation.isAuxiliaryFundsSupported}
                error={
                  !operation.capabilitiesLoading &&
                  !operation.isAuxiliaryFundsSupported
                    ? (operation.capabilitiesError ??
                      new Error('auxiliaryFunds not supported'))
                    : null
                }
                label="Capabilities"
              />
              <Status
                isLoading={operation.sendCallsStatus === 'pending'}
                isSuccess={operation.sendCallsStatus === 'success'}
                error={
                  operation.sendCallsStatus === 'error' ? operation.error : null
                }
                label="Transaction"
              />
              <Status
                isLoading={isPending}
                isSuccess={isConfirmed}
                error={
                  isFailed
                    ? new Error(
                        `Call failed (status: ${String(operation.callsStatus?.status)})`,
                      )
                    : null
                }
                label="Confirmation"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={disableSubmit}
          onClick={() => {
            operation.handleSubmit().catch(console.error);
          }}
        >
          {getButtonLabel(operation)}
        </Button>
      </CardFooter>
    </Card>
  );
}
