import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/client';
import { shouldAuth } from '../utils';

export const withAuth = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (shouldAuth) {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).end('Session not found');
      return;
    }
  }

  return handler(req, res);
};

export default withAuth;
