import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { NFTCollection } from '@/types/nft';

type CollectionSelectorProps = {
  collections: NFTCollection[];
  selectedCollection: NFTCollection | null;
  onCollectionSelect: (collection: NFTCollection) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function CollectionSelector({
  collections,
  selectedCollection,
  onCollectionSelect,
  disabled = false,
  placeholder = 'Select collection',
}: CollectionSelectorProps) {
  const handleValueChange = (value: string) => {
    const collection = collections.find((col) => col.contractAddress === value);
    if (collection) {
      onCollectionSelect(collection);
    }
  };

  return (
    <Select
      value={selectedCollection?.contractAddress ?? ''}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {selectedCollection && (
            <div className="flex items-center gap-2">
              {selectedCollection.collectionImage && (
                <img
                  src={selectedCollection.collectionImage}
                  alt={selectedCollection.name}
                  className="h-5 w-5 rounded"
                />
              )}
              <span className="font-medium">{selectedCollection.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {collections.map((collection) => (
          <SelectItem
            key={collection.contractAddress}
            value={collection.contractAddress}
          >
            <div className="flex items-center gap-2">
              {collection.collectionImage && (
                <img
                  src={collection.collectionImage}
                  alt={collection.name}
                  className="h-6 w-6 rounded"
                />
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{collection.name}</span>
                <span className="text-xs text-muted-foreground">
                  {collection.symbol} • {collection.mintPriceFormatted}
                </span>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                <div className="text-right">
                  <div>{collection.totalSupply.toLocaleString()}</div>
                  <div
                    className={
                      collection.isActive
                        ? 'text-green-600'
                        : 'text-destructive'
                    }
                  >
                    {collection.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
