import * as UserManager from '../../managers/UserManager';

import type { NextApiRequest, NextApiResponse } from 'next';

import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const get = ({ username }: { username: string }) => async (res: NextApiResponse) => {
  // const botDetectionData = await BotDetectorManager.getData({username})

  try {
    const user = await UserManager.get({ username });

    res.statusCode = HttpStatusCode.OK;
    res.setHeader('Cache-Control', `max-age=${60 * 60 * 1000}`);
    res.json({ status: 'ok', message: 'User detail', user });
    return res;
  } catch (e) {
    res.statusCode = HttpStatusCode.METHOD_FAILURE;
    res.json({ status: 'ko', message: e.toString() });
  }
};

const user = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.username) {
    return get(req.query as any)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(user));
