import type { Address } from 'viem';

import { NFT } from '@/components/nft/nft';
import { useNFT } from '@/hooks/use-nft';

type NFTMinterProps = {
  contractAddress?: Address;
  collectionName?: string;
  collectionSymbol?: string;
  collectionDescription?: string;
  collectionImage?: string;
  mintFunctionName?: string;
  priceFunctionName?: string;
};

const defaultProps = {
  contractAddress: '0x097fF9Cf279Dab00080310490A9e6DeEF52C404a' as Address,
  collectionName: 'Metamask Pay Test NFT',
  collectionSymbol: 'MMP-TST-NFT',
  collectionDescription: 'Test NFT collection',
  collectionImage: '',
  mintFunctionName: 'mint',
  priceFunctionName: 'mintPrice',
};

export function NFTMinter({
  contractAddress = defaultProps.contractAddress,
  collectionName = defaultProps.collectionName,
  collectionSymbol = defaultProps.collectionSymbol,
  collectionDescription = defaultProps.collectionDescription,
  collectionImage = defaultProps.collectionImage,
  mintFunctionName = defaultProps.mintFunctionName,
  priceFunctionName = defaultProps.priceFunctionName,
}: NFTMinterProps) {
  const {
    collections,
    mintData,
    userNFTs,
    mintStatus,
    isLoading,
    isMinting,
    isLoadingUserNFTs,
    error,
    handleMint,
    handleCollectionSelect,
    handleQuantityChange,
    handleRefreshUserNFTs,
    handleNFTSelect,
    isConnected,
    mintTxHash,
    mintSuccess,
  } = useNFT({
    contractAddress,
    collectionName,
    collectionSymbol,
    collectionDescription,
    collectionImage,
    mintFunctionName,
    priceFunctionName,
  });

  if (!isConnected) {
    return (
      <div className="mx-auto w-full max-w-md p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to mint NFTs
        </p>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="mx-auto w-full max-w-md p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Loading Collection...</h3>
        <p className="text-muted-foreground">
          Reading contract data from {contractAddress}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        {mintSuccess && mintTxHash && (
          <p className="mt-2 text-xs text-green-600">
            Mint successful! Tx: {mintTxHash.slice(0, 10)}...
          </p>
        )}
        {error && <p className="mt-2 text-xs text-red-600">Error: {error}</p>}
      </div>

      <NFT
        collections={collections}
        userNFTs={userNFTs}
        mintData={mintData}
        mintStatus={mintStatus}
        isLoading={isLoading}
        isMinting={isMinting}
        isLoadingUserNFTs={isLoadingUserNFTs}
        disabled={!isConnected}
        callbacks={{
          onCollectionSelect: handleCollectionSelect,
          onQuantityChange: handleQuantityChange,
          onMint: handleMint,
          onRefreshUserNFTs: handleRefreshUserNFTs,
          onNFTSelect: handleNFTSelect,
        }}
      />
    </div>
  );
}
