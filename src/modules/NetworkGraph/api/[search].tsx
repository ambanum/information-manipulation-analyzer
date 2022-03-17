import type { NextApiRequest, NextApiResponse } from 'next';

import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';
import * as graphApi from '../services/graph-api';

const get =
  ({ search: searchQuery }: { search: string }) =>
  async (res: NextApiResponse) => {
    try {
      const { search, status, message, error } = await graphApi.get(searchQuery);

      if (status === 'ko') {
        res.statusCode = HttpStatusCode.BAD_REQUEST;
        res.json({ status, message, error });
        return res;
      }
      res.statusCode = HttpStatusCode.OK;
      res.json({
        status: 'ok',
        message: 'search, nextgraph',
        searchGraph: search,
      });
    } catch (e: any) {
      res.statusCode = HttpStatusCode.METHOD_FAILURE;
      res.json({ status: 'ko', message: e.toString() });
    }
    return res;
  };

const refresh =
  ({ search: searchQuery }: { search: string }) =>
  async (res: NextApiResponse) => {
    try {
      const { search: searchGraph, status, message, error } = await graphApi.refresh(searchQuery);

      if (status === 'ko') {
        res.statusCode = HttpStatusCode.BAD_REQUEST;
        res.json({ status, message, error });
        return res;
      }
      res.statusCode = HttpStatusCode.OK;
      res.json({
        status: 'ok',
        message: 'Search added',
        searchGraph,
      });
    } catch (e: any) {
      res.statusCode = HttpStatusCode.METHOD_FAILURE;
      res.json({ status: 'ko', message: e.toString() });
    }
    return res;
  };

const graph = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.search) {
    return get(req.query as any)(res);
  }
  if (req.method === 'PUT' && req.query.search) {
    return refresh(req.query as any)(res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(graph));
