import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { parseEther } from 'viem';
import { useAccount, useSendTransaction } from 'wagmi';
import { Button } from './ui/button';

export function DynamicDashboard() {
  const account = useAccount();
  const { user, userWithMissingInfo, primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const send = useSendTransaction();

  const handleSend = () => {
    send.sendTransaction({
      to: '0x005958702dbCf1C499FFD67dc60dBd4C6992201E',
      value: parseEther('0.00001'),
    });
  };
  console.log({ error: send.error });

  return (
    <div>
      <p>user: {user?.email}</p>
      <p>wagmi address: {account.address}</p>
      <p>wagmi chain: {account.chain?.id}</p>
      <p>isLoggedIn: {String(isLoggedIn)}</p>
      <pre>{JSON.stringify(send.error, null, 2)}</pre>

      <Button onClick={handleSend}>Send</Button>
    </div>
  );
}
