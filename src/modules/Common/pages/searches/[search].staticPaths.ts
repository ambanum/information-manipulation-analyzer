import * as SearchManager from '../../managers/SearchManager';

import { GetStaticPaths } from 'next';
import dbConnect from 'utils/db';

export const getStaticPaths: GetStaticPaths<{
  search: string;
}> = async () => {
  await dbConnect();
  let searches = await SearchManager.listForPrerendering({ limit: 100, maxVolumetry: 50000 });
  searches = [];

  return {
    paths: searches.map(({ name }) => ({ params: { search: encodeURIComponent(name) } })), //indicates that no page needs be created at build time
    fallback: true,
  };
};

export default getStaticPaths;
