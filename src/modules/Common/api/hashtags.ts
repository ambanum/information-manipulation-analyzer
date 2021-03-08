// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateHashtagInput } from '../interfaces';
import Hashtag from '../models/Hashtag';
import * as HashtagManager from '../managers/HashtagManager';
import HttpStatusCode from 'http-status-codes';
import { withDb } from 'utils/db';

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.body as CreateHashtagInput;

  if (!name) {
    res.statusCode = HttpStatusCode.BAD_REQUEST;
    res.json({
      status: 'ko',
      message: 'Hashtag added',
    });
    return res;
  }

  let existingHashtag = await Hashtag.findOne({ name });

  if (!existingHashtag) {
    existingHashtag = new Hashtag({ name, status: 'PENDING' });
    await existingHashtag.save();
  }

  res.statusCode = HttpStatusCode.OK;
  res.json({
    status: 'ok',
    message: 'Hashtag added',
    hashtag: existingHashtag,
  });
  return res;
};

const list = async (req: NextApiRequest, res: NextApiResponse) => {
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

const site = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return create(req, res);
  }
  if (req.method === 'GET') {
    return list(req, res);
  }

  res.statusCode = HttpStatusCode.FORBIDDEN;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withDb(site);
