import * as SearchManager from '../../managers/SearchManager';

import type { NextApiRequest, NextApiResponse } from 'next';

import { GetSearchGraphResponse } from 'modules/Common/interfaces';
import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const get =
  ({ search }: { search: string }) =>
  async (res: NextApiResponse<GetSearchGraphResponse>) => {
    try {
      const { graphUrl, graphMetadata, graphUpdatedAt, graphProvider } =
        await SearchManager.getGraph({ name: search });

      res.statusCode = HttpStatusCode.OK;
      // res.setHeader('Cache-Control', `max-age=${60 * 60 * 1000}`);
      res.json({
        status: 'ok',
        message: 'search, nextgraph',
        url: graphUrl,
        metadata: graphMetadata,
        updatedAt: graphUpdatedAt,
        provider: graphProvider,
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
