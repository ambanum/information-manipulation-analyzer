import { Provider } from 'next-auth/client';
import React from 'react';
import SecuredArea from './SecuredArea';
import { shouldAuth } from '../utils';

interface AuthProviderProps {
  children: JSX.Element;
  pageProps: any;
}

const AuthProviderSecured = ({ children, pageProps }: AuthProviderProps) => {
  const [session, setSession] = React.useState<any>(pageProps.session);

  return (
    <Provider
      session={session}
      options={{
        // Client Max Age controls how often the useSession in the client should
        // contact the server to sync the session state. Value in seconds.
        // e.g.
        // * 0  - Disabled (always use cache value)
        // * 60 - Sync session state with server if it's older than 60 seconds
        clientMaxAge: 0,
        // Keep Alive tells windows / tabs that are signed in to keep sending
        // a keep alive request (which extends the current session expiry) to
        // prevent sessions in open windows from expiring. Value in seconds.
        //
        // Note: If a session has expired when keep alive is triggered, all open
        // windows / tabs will be updated to reflect the user is signed out.
        keepAlive: 0,
        basePath: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/auth`,
      }}
    >
      <SecuredArea onLoad={setSession} session={session}>
        {children}
      </SecuredArea>
    </Provider>
  );
};

const AuthProviderNormal = ({ children }: AuthProviderProps) => children;

export default shouldAuth ? AuthProviderSecured : AuthProviderNormal;
