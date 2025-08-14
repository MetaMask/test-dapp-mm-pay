import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Address } from 'viem';
import { formatEther, getContract } from 'viem';
import {
  useAccount,
  useBalance,
  useChainId,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from 'wagmi';

import { useQuery } from '@tanstack/react-query';
import { ERC721_ABI } from '@/abis/erc721-abi';
import { DEFAULT_NFT_IMAGE } from '@/constants/nft';
import { buildNFT } from '@/lib/nft';
import type { NFTCollection, NFT, MintStatus, NFTFormData } from '@/types/nft';

type useNFTParams = {
  contractAddress: Address;
  collectionName?: string;
  collectionSymbol?: string;
  collectionDescription?: string;
  collectionImage?: string;
  mintFunctionName?: string;
  priceFunctionName?: string;
};

export function useNFT({
  contractAddress,
  collectionName,
  collectionSymbol,
  collectionDescription,
  collectionImage,
  mintFunctionName = 'mint',
}: useNFTParams) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId });

  // State management
  const [mintData, setMintData] = useState<NFTFormData>({
    collection: null,
    mintQuantity: 1,
  });

  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [isLoadingUserNFTs, setIsLoadingUserNFTs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: contractData,
    isLoading,
    error: contractError,
    refetch: refetchContractData,
  } = useQuery({
    queryKey: ['user-nfts', contractAddress, address, chainId],
    enabled: Boolean(address && publicClient),
    queryFn: async () => {
      if (!address) {
        return;
      }

      const contract = getContract({
        address: contractAddress,
        abi: ERC721_ABI,
        client: publicClient!,
      });

      const calls = [
        contract.read.totalSupply(),
        contract.read.maxSupply(),
        contract.read.mintPrice(),
        contract.read.paused(),
        contract.read.balanceOf([address]),
      ];

      const [totalSupply, maxSupply, mintPrice, isPaused, userBalance] =
        await Promise.all(calls);

      return {
        totalSupply,
        maxSupply,
        mintPrice,
        isPaused,
        userBalance,
      };
    },
  });

  const { totalSupply, maxSupply, mintPrice, isPaused, userBalance } =
    contractData ?? {};

  // User's ETH balance for checking sufficient funds
  const { data: ethBalance } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
    },
  });

  // Contract write for minting
  const {
    writeContract,
    data: mintTxHash,
    isPending: isMinting,
    error: mintError,
    reset: resetMint,
  } = useWriteContract();

  // Wait for mint transaction
  const { isLoading: isWaitingForMint, isSuccess: mintSuccess } =
    useWaitForTransactionReceipt({
      hash: mintTxHash,
    });

  // Build collection object
  const collection: NFTCollection | null = useMemo(() => {
    console.log({ totalSupply, mintPrice });
    if (!mintPrice) {
      return null;
    }

    return {
      contractAddress,
      name: collectionName ?? 'Unknown',
      symbol: collectionSymbol ?? 'Unknown',
      description: collectionDescription,
      totalSupply: Number(totalSupply),
      maxSupply: maxSupply ? Number(maxSupply) : undefined,
      mintPrice: mintPrice.toString(),
      mintPriceFormatted: `${formatEther(mintPrice as bigint)} ETH`,
      owner: '0x0000000000000000000000000000000000000000', // We don't read owner in this example
      isActive: !isPaused,
      collectionImage,
    };
  }, [
    contractAddress,
    totalSupply,
    maxSupply,
    mintPrice,
    isPaused,
    collectionName,
    collectionSymbol,
    collectionDescription,
    collectionImage,
  ]);

  // Calculate mint status
  const mintStatus: MintStatus | null = useMemo(() => {
    if (!collection || !address || !isConnected) {
      return {
        isEligible: false,
        reason: 'Wallet not connected',
      };
    }

    // Check if collection is active
    if (!collection.isActive) {
      return {
        isEligible: false,
        reason: 'Minting is currently paused',
      };
    }

    // Check max supply
    if (
      collection.maxSupply &&
      collection.totalSupply >= collection.maxSupply
    ) {
      return {
        isEligible: false,
        reason: 'Maximum supply reached',
      };
    }

    // Check per-wallet limit

    // Check sufficient funds
    if (ethBalance) {
      const totalCost =
        BigInt(collection.mintPrice) * BigInt(mintData.mintQuantity);
      if (ethBalance.value < totalCost) {
        return {
          isEligible: false,
          reason: `Insufficient funds. Need ${formatEther(totalCost)} ETH`,
          maxMintPerAddress: 100000,
          currentMintCount: userBalance?.toString() ?? '0',
        };
      }
    }

    return {
      isEligible: true,
      reason: 'You are eligible to mint',
      maxMintPerAddress: 100000,
      currentMintCount: userBalance?.toString() ?? '0',
    };
  }, [
    collection,
    address,
    isConnected,
    userBalance,
    mintData.mintQuantity,
    ethBalance,
  ]);

  /**
   * Fetches user's NFTs from the contract
   */
  const fetchUserNFTs = useCallback(() => {
    if (!address || !collection || !userBalance) {
      setUserNFTs([]);
      return;
    }

    setIsLoadingUserNFTs(true);
    setError(null);

    try {
      const balance = Number(userBalance);
      if (balance === 0) {
        setUserNFTs([]);
        return;
      }

      // For simplicity, we'll try to fetch NFTs by checking token IDs
      const nfts: NFT[] = [];
      const totalSupplyNum = Number(totalSupply ?? 0);

      for (let i = 0; i < balance; i++) {
        const tokenId = (totalSupplyNum - i).toString();
        nfts.push(
          buildNFT(tokenId, contractAddress, address, '', {
            name: `${collection.name} #${tokenId}`,
            description: '',
            image: DEFAULT_NFT_IMAGE,
            external_url: '',
            attributes: [],
          }),
        );
      }

      setUserNFTs(nfts);
    } catch (err) {
      console.error('Error fetching user NFTs:', err);
      setError('Failed to fetch your NFTs');
    } finally {
      setIsLoadingUserNFTs(false);
    }
  }, [address, collection, userBalance, totalSupply, contractAddress]);

  /**
   * Handles minting NFTs
   * @param mintData - The mint data containing collection and quantity
   */
  const handleMint = useCallback(
    (mintData: NFTFormData) => {
      if (
        !mintData.collection ||
        !address ||
        !isConnected ||
        !mintStatus?.isEligible
      ) {
        setError('Invalid mint parameters');
        return;
      }

      resetMint();
      setError(null);

      const totalCost =
        BigInt(mintData.collection.mintPrice) * BigInt(mintData.mintQuantity);

      writeContract({
        address: contractAddress,
        abi: ERC721_ABI,
        functionName: mintFunctionName as any,
        args: [mintData.mintQuantity],
        value: totalCost,
      });
    },
    [
      address,
      isConnected,
      mintStatus,
      contractAddress,
      mintFunctionName,
      writeContract,
      resetMint,
    ],
  );

  /**
   * Updates the selected collection
   * @param collection - The newly selected collection
   */
  const handleCollectionSelect = useCallback((collection: NFTCollection) => {
    setMintData((prev) => ({
      ...prev,
      collection,
    }));
  }, []);

  /**
   * Updates the mint quantity
   * @param quantity - The new mint quantity
   */
  const handleQuantityChange = useCallback((quantity: number) => {
    setMintData((prev) => ({
      ...prev,
      mintQuantity: quantity,
    }));
  }, []);

  /**
   * Handles NFT selection
   * @param nft - The selected NFT
   */
  const handleNFTSelect = useCallback((nft: NFT) => {
    console.log('NFT selected:', nft);
    // Could open a modal with NFT details or transfer options
  }, []);

  // Update collection in mint data when it changes
  useEffect(() => {
    if (collection) {
      setMintData((prev) => ({
        ...prev,
        collection,
      }));
    }
  }, [collection]);

  // Handle mint success
  useEffect(() => {
    if (mintSuccess) {
      refetchContractData().catch(console.error);
      fetchUserNFTs();
      setError(null);
    }
  }, [mintSuccess, fetchUserNFTs]);

  // Handle mint error
  useEffect(() => {
    if (mintError) {
      setError(mintError.message || 'Mint failed');
    }
  }, [mintError]);

  return {
    // Data
    collections: collection ? [collection] : [],
    mintData,
    userNFTs,
    mintStatus,

    // Loading states
    isLoading, // We get mint status from computed state
    isMinting: isMinting || isWaitingForMint,
    isLoadingUserNFTs,

    // Error state
    error,

    // Actions
    handleMint,
    handleCollectionSelect,
    handleQuantityChange,
    handleRefreshUserNFTs: fetchUserNFTs,
    handleNFTSelect,

    // Connection state
    isConnected,

    // Transaction states
    mintTxHash,
    mintSuccess,
  };
}
