import * as SearchManager from '../../../managers/SearchManager';

import { CommonGetFilters, GetSearchResponse } from 'modules/Common/interfaces';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const get = (filter: CommonGetFilters) => async (res: NextApiResponse<GetSearchResponse>) => {
  try {
    const search = await SearchManager.getWithData(filter);

    if (filter.min && filter.max) {
      res.setHeader('Cache-Control', `max-age=${10 * 60}`);
    }
    res.statusCode = HttpStatusCode.OK;
    res.json({ status: 'ok', message: 'Search detail', ...search });
    return res;
  } catch (e) {
    res.statusCode = HttpStatusCode.METHOD_FAILURE;
    res.json({ status: 'ko', message: e.toString() });
  }
};

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.name) {
    return get(req.query as any)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(search));
