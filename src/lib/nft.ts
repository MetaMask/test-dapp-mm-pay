import { NFT_CONTRACTS } from '@/constants/nft';
import type { NFTMetadata, NFT } from '@/types/nft';

export function getNFTContractAddress(chainId: number) {
  const address = NFT_CONTRACTS[chainId];
  if (!address) {
    throw new Error(`No NFT collection on chain ${chainId}`);
  }
  return address;
}

/**
 * Fetches NFT metadata from a tokenURI
 * @param tokenURI - The URI to fetch metadata from
 * @returns Promise resolving to NFT metadata
 */
export async function fetchNFTMetadata(tokenURI: string): Promise<NFTMetadata> {
  try {
    // Handle IPFS URIs
    // let fetchURI = tokenURI;
    // if (tokenURI.startsWith('ipfs://')) {
    //   fetchURI = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
    // }

    // const response = await fetch(fetchURI);
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    // }

    // const metadata = await response.json();

    // Ensure required fields exist

    // return {
    //   name: metadata.name || 'Unnamed NFT',
    //   description: metadata.description || '',
    //   image: metadata.image || '',
    //   external_url: metadata.external_url,
    //   attributes: metadata.attributes || [],
    // };

    return {
      name: 'Unnamed NFT',
      description: '',
      image: '',
      external_url: '',
      attributes: [],
    };
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    // Return fallback metadata
    return {
      name: 'Failed to load',
      description: 'Could not fetch metadata',
      image: '',
      attributes: [],
    };
  }
}

/**
 * Builds an NFT object from contract data and metadata
 * @param tokenId - The token ID
 * @param contractAddress - The contract address
 * @param owner - The owner address
 * @param tokenURI - The token URI
 * @param metadata - The fetched metadata
 * @returns Complete NFT object
 */
export function buildNFT(
  tokenId: string,
  contractAddress: string,
  owner: string,
  tokenURI: string,
  metadata: NFTMetadata,
): NFT {
  return {
    tokenId,
    contractAddress,
    owner,
    tokenURI,
    metadata,
  };
}
