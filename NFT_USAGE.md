# Real NFT Hook Usage Guide

This guide explains how to use the real NFT hook (`useRealNFT`) to interact with actual ERC-721 contracts on the blockchain.

## Quick Start

Replace the example contract address in `App.tsx` with your actual NFT contract address:

```tsx
<RealNFTMinter
  contractAddress="0xYourActualNFTContractAddress"
  collectionName="Your Collection Name"
  collectionDescription="Description of your NFT collection"
  collectionImage="https://your-collection-image.com/image.png"
  mintFunctionName="mint" // or "publicMint", "safeMint", etc.
  priceFunctionName="mintPrice" // or "price", "cost", etc.
/>
```

## Contract Requirements

Your NFT contract should implement standard ERC-721 functions plus some common minting functions:

### Required Functions

- `name()` - Returns collection name
- `symbol()` - Returns collection symbol
- `totalSupply()` - Returns current total supply
- `balanceOf(address)` - Returns user's NFT balance
- `tokenURI(uint256)` - Returns metadata URI for a token
- `ownerOf(uint256)` - Returns owner of a token

### Common Mint Functions (one of these)

- `mint(address to, uint256 quantity)` - Standard mint function
- `publicMint(uint256 quantity)` - Public mint function
- `safeMint(address to, uint256 quantity)` - Safe mint function

### Common Price Functions (one of these)

- `mintPrice()` - Returns mint price in wei
- `price()` - Returns price in wei
- `cost()` - Returns cost in wei

### Optional Functions

- `maxSupply()` - Maximum supply limit
- `paused()` - Whether minting is paused
- `numberMinted(address)` - How many an address has minted
- `maxMintAmountPerWallet()` - Maximum mints per wallet

## Configuration Options

```tsx
type UseRealNFTParams = {
  contractAddress: Address; // Required: Your NFT contract address
  collectionName?: string; // Optional: Override contract name
  collectionSymbol?: string; // Optional: Override contract symbol
  collectionDescription?: string; // Optional: Collection description
  collectionImage?: string; // Optional: Collection image URL
  mintFunctionName?: string; // Optional: Mint function name (default: 'mint')
  priceFunctionName?: string; // Optional: Price function name (default: 'mintPrice')
};
```

## Example Contract Addresses

Here are some example NFT contracts you can test with (on mainnet):

```tsx
// CryptoPunks (historical, no mint function)
contractAddress = '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB';

// Bored Ape Yacht Club (historical, sold out)
contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';

// For testing, you'll want to deploy your own contract or use a testnet contract
```

## Contract Function Detection

The hook includes automatic detection for common function names:

### Mint Functions

The hook will automatically detect these common mint function names:

- `mint`
- `publicMint`
- `safeMint`
- `mintNFT`
- `mintTo`
- `purchase`
- `buy`

### Price Functions

The hook will automatically detect these common price function names:

- `mintPrice`
- `price`
- `cost`
- `publicPrice`
- `salePrice`

### Status Functions

The hook will automatically detect these status functions:

- `saleActive` / `mintingActive` / `publicSaleActive`
- `paused` / `isPaused`

## Features

### ✅ Real-time Data

- Fetches collection info directly from the blockchain
- Monitors totalSupply changes in real-time
- Updates user balances when new blocks are mined

### ✅ Mint Eligibility Checking

- Checks if minting is paused
- Validates maximum supply limits
- Checks per-wallet mint limits
- Verifies user has sufficient ETH

### ✅ Transaction Handling

- Handles mint transactions with proper gas estimation
- Provides transaction status (pending, success, failed)
- Automatic retry on failed transactions

### ✅ NFT Fetching

- Fetches user's NFTs from the contract
- Loads metadata from tokenURI
- Supports IPFS metadata URIs
- Rate-limited metadata fetching to avoid API limits

## Error Handling

The hook includes comprehensive error handling:

- Contract read failures
- Mint transaction failures
- Metadata fetching failures
- Network connectivity issues

## Customization

You can customize the hook behavior by:

1. Providing custom function names for your contract
2. Adding custom collection metadata
3. Extending the ABI with your contract's specific functions

## Security Considerations

- Always verify contract addresses before using
- Test on testnets before mainnet deployment
- Be aware of gas costs for minting operations
- Validate metadata sources for security

## Testnet Testing

For testing, consider deploying a simple NFT contract or using existing testnet contracts:

```solidity
// Simple ERC-721 contract example
contract SimpleNFT is ERC721 {
    uint256 public totalSupply;
    uint256 public maxSupply = 10000;
    uint256 public mintPrice = 0.01 ether;
    bool public paused = false;

    function mint(address to, uint256 quantity) external payable {
        require(!paused, "Minting paused");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");
        require(totalSupply + quantity <= maxSupply, "Max supply reached");

        for (uint256 i = 0; i < quantity; i++) {
            _mint(to, totalSupply + 1);
            totalSupply++;
        }
    }
}
```

## Troubleshooting

### Common Issues

1. **"Collection not loading"**

   - Verify the contract address is correct
   - Ensure the contract implements required ERC-721 functions
   - Check if you're on the correct network

2. **"Mint function not found"**

   - Check if your contract uses a different mint function name
   - Specify the correct `mintFunctionName` parameter

3. **"Price not loading"**

   - Check if your contract uses a different price function name
   - Specify the correct `priceFunctionName` parameter

4. **"User NFTs not loading"**
   - This is expected behavior for large collections
   - The hook uses a simplified approach for demo purposes
   - For production, consider using indexing services like The Graph

### Need Help?

If you encounter issues:

1. Check the browser console for error messages
2. Verify your contract ABI matches the expected functions
3. Test with a known working contract first
4. Consider using a block explorer to verify contract functions
