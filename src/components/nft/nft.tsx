import { Image, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

import { CollectionSelector } from '@/components/nft/collection-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEFAULT_MINT_QUANTITY, MAX_MINT_QUANTITY } from '@/constants/nft';
import { trimNumber } from '@/lib/utils';
import type { NFTComponentProps } from '@/types/nft';

export function NFT({
  collections,
  userNFTs = [],
  mintData,
  mintStatus,
  isLoading = false,
  isMinting = false,
  callbacks,
  disabled = false,
  userAddress,
}: NFTComponentProps) {
  const { collection, mintQuantity } = mintData;
  const { onCollectionSelect, onQuantityChange, onMint, onRefreshUserNFTs } =
    callbacks;

  // const [activeTab, setActiveTab] = useState<'mint' | 'collection'>('mint');

  // Auto-refresh user NFTs when collection changes
  useEffect(() => {
    if (collection && userAddress) {
      onRefreshUserNFTs();
    }
  }, [collection, userAddress, onRefreshUserNFTs]);

  /**
   * Handles mint quantity input change
   * @param value - New quantity value as string
   */
  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value, 10) || DEFAULT_MINT_QUANTITY;
    const clampedQuantity = Math.min(Math.max(quantity, 1), MAX_MINT_QUANTITY);
    onQuantityChange(clampedQuantity);
  };

  // Calculate total mint cost
  const totalMintCostFormatted = collection
    ? `${trimNumber(
        ((parseFloat(collection.mintPrice) * mintQuantity) / 1e18).toString(),
      )} ETH`
    : '0 ETH';

  // Determine if minting is possible
  const canMint =
    collection &&
    mintQuantity > 0 &&
    !isLoading &&
    !disabled &&
    mintStatus?.isEligible &&
    collection.isActive;

  const handleMint = () => {
    if (canMint && collection) {
      onMint(mintData);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          NFT Minter
        </CardTitle>

        {/* Tab Navigation */}
        {/* <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('mint')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'mint'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Mint
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'collection'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            My NFTs ({collectionUserNFTs.length})
          </button>
        </div> */}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Collection Selection */}
        <div className="space-y-2">
          <Label htmlFor="collection-select">Collection</Label>
          <CollectionSelector
            collections={collections}
            selectedCollection={collection}
            onCollectionSelect={onCollectionSelect}
            disabled={disabled}
            placeholder="Select a collection"
          />
        </div>

        {/* Collection Information */}
        {collection && (
          <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Supply</span>
              <span>
                {collection.totalSupply.toLocaleString()}
                {collection.maxSupply &&
                  ` / ${collection.maxSupply.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mint Price</span>
              <span>{collection.mintPriceFormatted}</span>
            </div>
            {/* <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span
                className={
                  collection.isActive ? 'text-green-600' : 'text-destructive'
                }
              >
                {collection.isActive ? 'Active' : 'Inactive'}
              </span>
            </div> */}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Owned</span>
              <span>{userNFTs.length.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* {activeTab === 'mint' && ( */}
        <>
          {/* Mint Quantity */}
          {collection && (
            <div className="space-y-2">
              <Label htmlFor="mint-quantity">Quantity</Label>
              <Input
                id="mint-quantity"
                type="number"
                min="1"
                max={MAX_MINT_QUANTITY}
                value={mintQuantity}
                onChange={(event) => handleQuantityChange(event.target.value)}
                disabled={disabled}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                Total Cost: {totalMintCostFormatted}
              </p>
            </div>
          )}

          {/* Mint Button */}
          <Button
            onClick={handleMint}
            disabled={!canMint || isMinting}
            className="w-full"
            size="lg"
          >
            {(() => {
              if (isMinting) {
                return (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Minting...
                  </div>
                );
              }
              if (!collection) {
                return 'Select a collection';
              }
              if (!collection.isActive) {
                return 'Collection inactive';
              }
              if (!mintStatus?.isEligible) {
                return mintStatus?.reason ?? 'Not eligible to mint';
              }
              return `Mint ${mintQuantity} NFT${
                mintQuantity > 1 ? 's' : ''
              } for ${totalMintCostFormatted}`;
            })()}
          </Button>
        </>
        {/* )} */}
      </CardContent>
    </Card>
  );
}
