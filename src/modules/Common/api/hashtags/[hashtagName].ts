import * as HashtagManager from '../../managers/HashtagManager';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const get = (name: string) => async (res: NextApiResponse) => {
  try {
    const hashtag = await HashtagManager.getWithData({ name });

    res.statusCode = HttpStatusCode.OK;
    res.json({ status: 'ok', message: 'Hashtag detail', ...hashtag });
    return res;
  } catch (e) {
    res.statusCode = HttpStatusCode.METHOD_FAILURE;
    res.json({ status: 'ko', message: e.toString() });
  }
};

const hashtag = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.hashtagName) {
    return get(req.query.hashtagName as string)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(hashtag));
