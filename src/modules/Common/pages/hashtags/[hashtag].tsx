import dayjs from 'dayjs';
import Layout from 'modules/Embassy/components/Layout';
import { GetStaticPaths } from 'next';
import Link from 'next/link';
import dbConnect from 'utils/db';
import VolumetryGraph, {
  VolumetryGraphOptions,
  VolumetryGraphProps,
} from '../../components/VolumetryGraph';
import { Hashtag } from '../../interfaces';
import * as HashtagManager from '../../managers/HashtagManager';

export default function HashtagPage({
  hashtag,
  volumetry,
}: {
  hashtag: Hashtag;
  volumetry: VolumetryGraphProps['data'];
}) {
  const onClick: VolumetryGraphOptions['onClick'] = (point) => {
    const startDate = dayjs(point.data.x).startOf('day').format('YYYY-MM-DD');
    const endDate = dayjs(point.data.x).add(1, 'day').startOf('day').format('YYYY-MM-DD');
    window.open(
      `https://twitter.com/search?q=${hashtag.name}%20until%3A${endDate}%20%20since%3A${startDate}&src=typed_query`
    );
  };

  return (
    <Layout title={`#${hashtag.name} | Information Manipulation Analyzer`}>
      <div className="rf-container rf-mb-12w">
        <div className="rf-grid-row">
          <div className="rf-col">
            <div className="text-center rf-my-3w">
              <Link href="/">
                <a className="rf-link rf-fi-arrow-left-line rf-link--icon-left">Back</a>
              </Link>
            </div>
            <h1 className="text-center">#{hashtag.name}</h1>
            <h6 className="text-center">Information Manipulation Analyzer</h6>

            {hashtag.status === 'PENDING' && volumetry[0]?.data?.length === 0 && (
              <div className="text-center rf-my-12w">
                <span className="rf-tag">{hashtag.status}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {hashtag.status === 'PENDING' && volumetry[0]?.data?.length > 0 && (
        <div style={{ height: '600px', width: '100%' }}>
          <VolumetryGraph data={volumetry} options={{ onClick }} />
        </div>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths<{
  hashtag: string;
}> = async () => {
  await dbConnect();
  const hashtags = await HashtagManager.list();

  return {
    paths: hashtags.map(({ name }) => ({ params: { hashtag: name } })), //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export async function getStaticProps({ params }: { params: { hashtag: string } }) {
  await dbConnect();
  const hashtag = await HashtagManager.get({ name: params.hashtag });

  const volumetry = hashtag.volumetry.reduce(
    (acc: VolumetryGraphProps['data'], volumetry) => {
      const newAcc = [...acc];
      newAcc[0].data.push({ x: volumetry.date, y: volumetry.nbTweets });
      newAcc[1].data.push({ x: volumetry.date, y: volumetry.nbRetweets });
      return acc;
    },
    [
      { id: 'nbTweets', data: [] },
      { id: 'nbRetweets', data: [] },
    ]
  );

  return {
    props: {
      hashtag: hashtag ? JSON.parse(JSON.stringify(hashtag, null, 2)) : null,
      volumetry: JSON.parse(JSON.stringify(volumetry, null, 2)),
    },
    revalidate: 300,
    notFound: !hashtag,
  };
}
