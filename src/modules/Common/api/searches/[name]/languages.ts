import * as SearchManager from '../../../managers/SearchManager';

import { CommonGetFilters, GetSearchLanguagesResponse } from 'modules/Common/interfaces';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const getLanguages =
  (filter: CommonGetFilters) => async (res: NextApiResponse<GetSearchLanguagesResponse>) => {
    try {
      const search = await SearchManager.get({ name: filter.name });

      if (!search) {
        res.statusCode = HttpStatusCode.NOT_FOUND;
        res.json({ status: 'ko', message: 'Search was not found' });
        return;
      }
      const languages = await SearchManager.getLanguages({
        searchIds: [search._id],
        startDate: filter.min,
        endDate: filter.max,
        lang: filter.lang,
        username: filter.username,
      });
      if (filter.min && filter.max) {
        res.setHeader('Cache-Control', `max-age=${10 * 60}`);
      }
      res.statusCode = HttpStatusCode.OK;
      res.json({ status: 'ok', message: 'Search Languages details', languages });
      return res;
    } catch (e) {
      res.statusCode = HttpStatusCode.METHOD_FAILURE;
      res.json({ status: 'ko', message: e.toString() });
    }
  };

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.name) {
    return getLanguages(req.query as any)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(search));
