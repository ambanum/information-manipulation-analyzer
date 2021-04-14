import { getSession, signIn, signOut } from 'next-auth/client';

import React from 'react';

const SecuredArea = ({ children, session, onLoad }: any) => {
  React.useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        signIn();
      } else {
        onLoad(session);
      }
    })();
  }, []);

  if (session === undefined) {
    return <div>Authenticating...</div>;
  }

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <button onClick={() => signOut()}>logout</button>
      </div>
      {children}
    </>
  );
};

export default SecuredArea;
