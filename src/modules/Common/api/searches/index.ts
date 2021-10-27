import * as SearchManager from '../../managers/SearchManager';

import { CreateSearchInput, CreateSearchResponse } from '../../interfaces';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sanitizeText, sanitizeUrl, sanitizeWord } from 'utils/sanitizer';

import HttpStatusCode from 'http-status-codes';
import { SearchTypes } from 'modules/Common/models/Search';
import { getUrlType } from 'utils/api';
import { withAuth } from 'modules/Auth';
import { withDb } from 'utils/db';

const invalidMimes = ['image', 'video', 'application'];

const create = async (req: NextApiRequest, res: NextApiResponse<CreateSearchResponse>) => {
  const { name } = req.body as CreateSearchInput;

  if (!name) {
    res.statusCode = HttpStatusCode.BAD_REQUEST;
    res.json({
      status: 'ko',
      message: 'Search not provided',
    });
    return res;
  }
  let sanitizedName = sanitizeText(name);
  let type: keyof typeof SearchTypes = 'KEYWORD';

  // check if name is URL
  if (name.match(/^https?:\/\//)) {
    try {
      const urlType = await getUrlType(name);

      if (invalidMimes.some((invalidMime) => urlType.startsWith(invalidMime))) {
        res.statusCode = HttpStatusCode.OK;
        res.json({
          status: 'ko',
          message: "We're sorry but we do not yet support images, videos and files",
        });
        return res;
      }
    } catch (e) {
      console.warn('we could not detect the type of url this is', name);
    }
    type = 'URL';
    sanitizedName = sanitizeUrl(name);
  } else if (name.startsWith('@')) {
    type = 'MENTION';
    sanitizedName = `@${sanitizeWord(name)}`;
  } else if (name.startsWith('#')) {
    type = 'HASHTAG';
    sanitizedName = `#${sanitizeWord(name)}`;
  } else if (name.startsWith('$')) {
    type = 'CASHTAG';
    sanitizedName = `$${sanitizeWord(name)}`;
  }

  let existingSearch: any = await SearchManager.get({ name: sanitizedName });

  if (!existingSearch) {
    existingSearch = await SearchManager.create({ name: sanitizedName, type });
  }

  res.statusCode = HttpStatusCode.OK;
  res.json({
    status: 'ok',
    message: 'Search added',
    search: existingSearch,
  });
  return res;
};

const list = async (_: any, res: NextApiResponse) => {
  try {
    const searches = await SearchManager.list();

    res.statusCode = HttpStatusCode.OK;
    res.json({ status: 'ok', message: 'List of searches', searches });
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
