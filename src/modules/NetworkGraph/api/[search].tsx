import type { NextApiRequest, NextApiResponse } from 'next';

import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';
import * as graphApi from '../services/graph-api';

const get =
  ({ search: searchQuery }: { search: string }) =>
  async (res: NextApiResponse) => {
    try {
      const { search } = await graphApi.get(searchQuery);

      res.statusCode = HttpStatusCode.OK;
      res.json({
        status: 'ok',
        message: 'search, nextgraph',
        searchGraph: search,
      });
      return res;
    } catch (e: any) {
      res.statusCode = HttpStatusCode.METHOD_FAILURE;
      res.json({ status: 'ko', message: e.toString() });
    }
  };

const graph = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.search) {
    return get(req.query as any)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(graph));
