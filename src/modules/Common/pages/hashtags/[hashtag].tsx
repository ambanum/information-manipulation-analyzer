import Layout from 'modules/Embassy/components/Layout';
import { GetStaticPaths } from 'next';
import Link from 'next/link';
import dbConnect from 'utils/db';
import { Hashtag } from '../../interfaces';
import * as HashtagManager from '../../managers/HashtagManager';
import styles from 'modules/DesignSystem/pages/index.module.scss';
import VolumetryGraph, { VolumetryGraphProps } from '../../components/VolumetryGraph';

export default function HashtagPage({
  hashtag,
  volumetry,
}: {
  hashtag: Hashtag;
  volumetry: VolumetryGraphProps['data'];
}) {
  return (
    <Layout title={`#${hashtag.name} | Information Manipulation Analyzer`}>
      <div className="rf-container">
        <div className="rf-grid-row">
          <div className="rf-col">
            <Link href="/">
              <a className="rf-link rf-fi-arrow-left-line rf-link--icon-left">Back</a>
            </Link>
            <h1 className={styles['text-center']}>#{hashtag.name}</h1>
            <h6 className={styles['text-center']}>Information Manipulation Analyzer</h6>

            {hashtag.status === 'PENDING' && volumetry[0]?.data?.length === 0 && (
              <span className="rf-tag">{hashtag.status}</span>
            )}
          </div>
        </div>
      </div>
      {hashtag.status === 'PENDING' && volumetry[0]?.data?.length > 0 && (
        <div style={{ height: '600px', width: '100%' }}>
          <VolumetryGraph data={volumetry} />
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
      console.log(volumetry);
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
