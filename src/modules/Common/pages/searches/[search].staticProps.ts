import * as SearchManager from '../../managers/SearchManager';

import dbConnect from 'utils/db';

export default async function getStaticProps({ params }: { params: { search: string } }) {
  await dbConnect();

  const result = await SearchManager.getWithData({ name: params.search });

  return {
    props: JSON.parse(JSON.stringify(result)),
    revalidate: 300,
    notFound: !result.search,
  };
}
