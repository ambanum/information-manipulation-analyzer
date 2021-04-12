import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/client';
import { shouldAuth } from '../utils';

export const withAuth = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (shouldAuth) {
    const session = await getSession({ req });
    console.log(''); // eslint-disable-line
    console.log('╔════START══session══════════════════════════════════════════════════'); // eslint-disable-line
    console.log(session); // eslint-disable-line
    console.log('╚════END════session══════════════════════════════════════════════════'); // eslint-disable-line

    if (!session) {
      res.status(401).end('Session not found');
      return;
    }
  }

  return handler(req, res);
};

export default withAuth;
