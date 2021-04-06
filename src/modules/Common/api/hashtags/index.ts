import * as HashtagManager from '../../managers/HashtagManager';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateHashtagInput } from '../../interfaces';
import HttpStatusCode from 'http-status-codes';
import { withDb } from 'utils/db';

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.body as CreateHashtagInput;

  if (!name) {
    res.statusCode = HttpStatusCode.BAD_REQUEST;
    res.json({
      status: 'ko',
      message: 'Hashtag not provided',
    });
    return res;
  }

  const sanitizedName = name
    // replace all accents with plain
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // kepp only allowed characters in hashtag
    .replace(/[^a-zA-Z\d_]/gim, '')
    .toLowerCase();

  let existingHashtag: any = await HashtagManager.get({ name: sanitizedName });

  if (!existingHashtag) {
    existingHashtag = await HashtagManager.create({ name: sanitizedName });
  }

  res.statusCode = HttpStatusCode.OK;
  res.json({
    status: 'ok',
    message: 'Hashtag added',
    hashtag: existingHashtag,
  });
  return res;
};

const list = async (_: any, res: NextApiResponse) => {
  try {
    const hashtags = await HashtagManager.list();

    res.statusCode = HttpStatusCode.OK;
    res.json({ status: 'ok', message: 'List of hashtags', hashtags });
    return res;
  } catch (e) {
    res.statusCode = HttpStatusCode.METHOD_FAILURE;
    res.json({ status: 'ko', message: e.toString() });
  }
};
const hashtags = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return create(req, res);
  }
  if (req.method === 'GET') {
    return list(req, res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withDb(hashtags);
