import * as SearchManager from '../../managers/SearchManager';

import dbConnect from 'utils/db';
import pTimeout from '@lolpants/ptimeout';

const MAX_EXECUTION_TIME = 60 * 1000; // 1 minute

export default async function getStaticProps({ params }: { params: { search: string } }) {
  await dbConnect();
  let result: any = {};
  try {
    result = await pTimeout(
      async () => await SearchManager.getWithData({ name: params.search }),
      MAX_EXECUTION_TIME
    );
  } catch (e) {
    console.error(`Could not generate static props for ${params.search}: `, e.toString());
  }

  return {
    props: JSON.parse(JSON.stringify(result)),
    revalidate: 300, // seconds
    notFound: !result?.search,
  };
}
