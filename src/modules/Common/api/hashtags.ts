// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import Hashtag from '../models/Hashtag';
import { withDb } from 'utils/db';

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.body;

  let existingHashtag = await Hashtag.findOne({ name });

  if (!existingHashtag) {
    existingHashtag = new Hashtag({ name, status: 'PENDING' });
    await existingHashtag.save();
  }

  res.statusCode = 200;
  res.json({
    status: 'ok',
    message: 'Hashtag added',
    hashtag: existingHashtag,
  });
  return res;
};

const list = async (req: NextApiRequest, res: NextApiResponse) => {
  const hashtags = await Hashtag.find().lean();

  res.statusCode = 200;
  res.json({ status: 'ok', message: 'List of hashtags', hashtags });
  return res;
};

const site = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return create(req, res);
  }
  if (req.method === 'GET') {
    return list(req, res);
  }

  res.statusCode = 403;
  res.json({ status: 'ko', message: 'Nothing there' });
};

export default withDb(site);
