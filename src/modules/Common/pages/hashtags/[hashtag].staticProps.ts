import * as HashtagManager from '../../managers/HashtagManager';

import dbConnect from 'utils/db';

export default async function getStaticProps({ params }: { params: { hashtag: string } }) {
  await dbConnect();
  const result = await HashtagManager.getWithData({ name: params.hashtag });

  return {
    props: JSON.parse(JSON.stringify(result)),
    revalidate: 300,
    notFound: !result.hashtag,
  };
}
