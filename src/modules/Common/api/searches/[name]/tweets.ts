import * as SearchManager from '../../../managers/SearchManager';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { GetSearchTweetsResponse } from 'modules/Common/interfaces';
import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const getTweets =
  (filter: { name: string; min?: string; max?: string; lang?: string }) =>
  async (res: NextApiResponse<GetSearchTweetsResponse>) => {
    try {
      const search = await SearchManager.get({ name: filter.name });

      if (!search) {
        res.statusCode = HttpStatusCode.NOT_FOUND;
        res.json({ status: 'ko', message: 'Search was not found' });
        return;
      }
      const tweets = await SearchManager.getTweets({
        searchIds: [search._id],
        startDate: filter.min,
        endDate: filter.max,
        lang: filter.lang,
      });

      if (filter.min && filter.max) {
        res.setHeader('Cache-Control', `max-age=${10 * 60}`);
      }
      res.statusCode = HttpStatusCode.OK;
      res.json({ status: 'ok', message: 'Search Tweets details', ...tweets });
      return res;
    } catch (e) {
      res.statusCode = HttpStatusCode.METHOD_FAILURE;
      res.json({ status: 'ko', message: e.toString() });
    }
  };

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.name) {
    return getTweets(req.query as any)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(search));
