import type { Address } from 'viem';

import { NFT } from '@/components/nft/nft';
import { useNFT } from '@/hooks/use-nft';

type NFTMinterProps = {
  contractAddress: Address;
  collectionName?: string;
  collectionSymbol?: string;
  collectionDescription?: string;
  collectionImage?: string;
  mintFunctionName?: string;
  priceFunctionName?: string;
};

export function NFTMinter({
  contractAddress,
  collectionName,
  collectionSymbol,
  collectionDescription,
  collectionImage,
  mintFunctionName = 'mint',
  priceFunctionName = 'mintPrice',
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
      <div className="w-full max-w-md mx-auto p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to mint NFTs
        </p>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Loading Collection...</h3>
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
          <p className="text-xs text-green-600 mt-2">
            Mint successful! Tx: {mintTxHash.slice(0, 10)}...
          </p>
        )}
        {error && <p className="text-xs text-red-600 mt-2">Error: {error}</p>}
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
