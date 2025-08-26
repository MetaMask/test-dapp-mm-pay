import { usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth';
import { Button } from './ui/button';
import { parseEther } from 'viem';

export function PrivyTest() {
  const privy = usePrivy();
  const wallets = useWallets();
  const sendTransaction = useSendTransaction();

  console.log(wallets);
  const handleSendTransaction = async () => {
    const tx = await sendTransaction.sendTransaction(
      {
        chainId: 8453,
        to: wallets?.wallets[1]?.address,
        value: parseEther('0.00002'),
      },
      { address: wallets?.wallets[0]?.address },
    );
    console.log(tx);
  };

  return (
    <div>
      {wallets.wallets.map((wal, index) => (
        <div>
          <p>
            {index} - {wal.address} - {wal.connectorType}
          </p>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-4">
        <Button onClick={privy.connectOrCreateWallet}>Connect</Button>
        <Button onClick={privy.createWallet}>Create Wallet</Button>
        <Button onClick={handleSendTransaction}>Send Transaction</Button>
        <Button onClick={privy.logout}>Logout</Button>
      </div>
    </div>
  );
}
