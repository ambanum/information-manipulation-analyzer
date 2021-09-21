import * as SearchManager from '../../../managers/SearchManager';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { GetSearchSplitRequestsResponse } from 'modules/Common/interfaces';
import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const get =
  (filter: { name: string; min?: string; max?: string }) =>
  async (res: NextApiResponse<GetSearchSplitRequestsResponse>) => {
    try {
      const splits = await SearchManager.splitRequests(filter);

      if (!splits) {
        res.statusCode = HttpStatusCode.NOT_FOUND;
        res.json({ status: 'ko', message: 'Could not split requests' });
        return;
      }
      const { nbTweets, periods, search } = splits;
      res.statusCode = HttpStatusCode.OK;

      res.json({
        status: 'ok',
        message: 'Search split',
        nbTweets,
        search,
        filters: periods.map((period) => ({ ...period, name: filter.name })),
      });
      return res;
    } catch (e) {
      res.statusCode = HttpStatusCode.METHOD_FAILURE;
      res.json({ status: 'ko', message: e.toString() });
    }
  };

const split = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.name) {
    return get(req.query as any)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(split));
