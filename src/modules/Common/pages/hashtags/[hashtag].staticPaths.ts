import * as HashtagManager from '../../managers/HashtagManager';

import { GetStaticPaths } from 'next';
import dbConnect from 'utils/db';

export const getStaticPaths: GetStaticPaths<{
  hashtag: string;
}> = async () => {
  await dbConnect();
  const hashtags = await HashtagManager.listForPrerendering({ limit: 100, maxVolumetry: 50000 });
  return {
    paths: hashtags.map(({ name }) => ({ params: { hashtag: name } })), //indicates that no page needs be created at build time
    fallback: true,
  };
};

export default getStaticPaths;
