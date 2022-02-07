// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import HttpStatusCode from 'http-status-codes';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';
import { GraphsSearchResponse, CreateSearchResponse } from '../interfaces';

import * as graphApi from '../services/graph-api';

const create = async (req: NextApiRequest, res: NextApiResponse<CreateSearchResponse>) => {
  const { search = '' } = req.body;

  if (!search) {
    res.statusCode = HttpStatusCode.BAD_REQUEST;
    res.json({
      status: 'ko',
      message: 'Search not provided',
    });
    return res;
  }
  const { search: searchGraph, status, message, error } = await graphApi.create(search);

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

  return res;
};

const list = async (_: any, res: NextApiResponse<GraphsSearchResponse>) => {
  try {
    const { searches } = await graphApi.list();

    res.statusCode = HttpStatusCode.OK;
    res.json({ status: 'ok', message: 'List of graph searches', searchGraphs: searches });
    return res;
  } catch (e: any) {
    res.statusCode = HttpStatusCode.METHOD_FAILURE;
    res.json({ status: 'ko', message: e.toString() });
  }
};

const searches = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return create(req, res);
  }
  if (req.method === 'GET') {
    return list(req, res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withAuth(withDb(searches));
