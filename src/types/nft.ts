export type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: {
    trait_type: string;
    value: string | number;
  }[];
};

export type NFT = {
  tokenId: string;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  tokenURI: string;
};

export type NFTCollection = {
  contractAddress: string;
  name: string;
  symbol: string;
  description?: string;
  totalSupply: number;
  maxSupply?: number;
  mintPrice: string; // in wei
  mintPriceFormatted: string; // formatted for display
  owner: string;
  isActive: boolean;
  baseURI?: string;
  collectionImage?: string;
  website?: string;
  twitter?: string;
  discord?: string;
};

export type MintStatus = {
  isEligible: boolean;
  reason?: string;
  maxMintPerAddress?: number;
  currentMintCount?: number | string;
};

export type NFTFormData = {
  collection: NFTCollection | null;
  mintQuantity: number;
  recipient?: string; // optional recipient address
};

export type NFTCallbacks = {
  onCollectionSelect: (collection: NFTCollection) => void;
  onQuantityChange: (quantity: number) => void;
  onMint: (mintData: NFTFormData) => void;
  onRefreshUserNFTs: () => void;
  onNFTSelect?: (nft: NFT) => void;
};

export type NFTComponentProps = {
  collections: NFTCollection[];
  userNFTs: NFT[];
  mintData: NFTFormData;
  mintStatus?: MintStatus | null;
  isLoading?: boolean;
  isMinting?: boolean;
  isLoadingUserNFTs?: boolean;
  callbacks: NFTCallbacks;
  disabled?: boolean;
  userAddress?: string;
};
