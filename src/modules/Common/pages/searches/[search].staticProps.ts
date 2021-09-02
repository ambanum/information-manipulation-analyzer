import * as SearchManager from '../../managers/SearchManager';

import dbConnect from 'utils/db';

export default async function getStaticProps({ params }: { params: { search: string } }) {
  await dbConnect();
  let result: any = {};
  try {
    result = await SearchManager.getWithData({ name: params.search });
  } catch (e) {
    console.error(`Could not generate static props for ${params.search}: `, e.toString());
  }

  return {
    props: JSON.parse(JSON.stringify(result)),
    revalidate: 300,
    notFound: !result?.search,
  };
}
