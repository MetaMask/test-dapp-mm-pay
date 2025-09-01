import { usePrivy } from '@privy-io/react-auth';

import { Button } from './ui/button';

export function PrivyConnector() {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) {
    return <div />;
  }

  return (
    <div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            if (authenticated) {
              logout().catch(console.error);
            } else {
              login();
            }
          }}
        >
          {authenticated ? 'Logout' : 'Login'}
        </Button>
      </div>
    </div>
  );
}
