import { Provider, getSession, signIn, signOut } from 'next-auth/client';

import React from 'react';
import { shouldAuth } from '../utils';

interface AuthProviderProps {
  children: JSX.Element;
}

const AuthProviderSecured = ({ children }: AuthProviderProps) => {
  const [session, setSession] = React.useState<any>(undefined);

  React.useEffect(() => {
    (async () => {
      const session = await getSession();
      setSession(session);
    })();
  }, []);

  if (session === undefined) {
    return <div>Authenticating...</div>;
  }

  if (session === null) {
    signIn();
    return null;
  }

  return (
    <Provider session={session}>
      <div style={{ textAlign: 'right' }}>
        <button onClick={() => signOut()}>logout</button>
      </div>
      {children}
    </Provider>
  );
};

const AuthProviderNormal = ({ children }: AuthProviderProps) => children;

export default shouldAuth ? AuthProviderSecured : AuthProviderNormal;
