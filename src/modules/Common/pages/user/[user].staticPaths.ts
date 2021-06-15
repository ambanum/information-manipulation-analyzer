/* import dbConnect from 'utils/db';
import * as HashtagManager from '../../managers/HashtagManager'; */
import { GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths<{
  hashtag: string;
}> = async () => {
  /* await dbConnect();
  const hashtags = await HashtagManager.list(); */
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default getStaticPaths;
