import * as HashtagManager from '../../managers/HashtagManager';

import type { NextApiRequest, NextApiResponse } from 'next';

import { GetSearchGraphResponse } from 'modules/Common/interfaces';
import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const get =
  ({ hashtag }: { hashtag: string }) =>
  async (res: NextApiResponse<GetSearchGraphResponse>) => {
    try {
      const { graphUrl, graphMetadata, graphUpdatedAt, graphProvider } =
        await HashtagManager.getGraph({ name: hashtag });

      res.statusCode = HttpStatusCode.OK;
      // res.setHeader('Cache-Control', `max-age=${60 * 60 * 1000}`);
      res.json({
        status: 'ok',
        message: 'Hashtag graph',
        url: graphUrl,
        metadata: graphMetadata,
        updatedAt: graphUpdatedAt,
        provider: graphProvider,
      });
      return res;
    } catch (e) {
      res.statusCode = HttpStatusCode.METHOD_FAILURE;
      res.json({ status: 'ko', message: e.toString() });
    }
  };

const graph = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.hashtag) {
    return get(req.query as any)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(graph));
