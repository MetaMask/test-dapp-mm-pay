import { NFTMinter } from '@/components/nft/nft-minter';
import { UniswapSwap } from '@/components/swap/uniswap-swap';
import type { IntegrationType } from '@/constants/integrations';

type IntegrationWrapperProps = {
  integrationType?: IntegrationType;
  SwapComponent?: React.ComponentType;
  NFTMinterComponent?: React.ComponentType;
};

export function IntegrationWrapper({
  integrationType,
  SwapComponent = UniswapSwap,
  NFTMinterComponent = NFTMinter,
}: IntegrationWrapperProps) {
  return (
    <div className="space-y-8">
      {integrationType && (
        <div className="text-center">
          <p className="mb-6 text-sm text-muted-foreground">
            Current integration: {integrationType}
          </p>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex justify-center">
          <SwapComponent />
        </div>
        <div className="flex justify-center">
          <NFTMinterComponent />
        </div>
      </div>
    </div>
  );
}
