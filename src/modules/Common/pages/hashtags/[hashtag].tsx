import Layout from 'modules/Common/components/Layout';
import { GetStaticPaths } from 'next';
import dbConnect from 'utils/db';
import { Hashtag } from '../../interfaces';
import * as HashtagManager from '../../managers/HashtagManager';
import styles from 'modules/DesignSystem/pages/index.module.scss';

export default function HashtagPage({ hashtag }: { hashtag: Hashtag }) {
  return (
    <Layout title="Information Manipulation Analyzer">
      <h1 className={styles['text-center']}>#{hashtag.name}</h1>
      <h6 className={styles['text-center']}>Information Manipulation Analyzer</h6>
      <span className="rf-tag">{hashtag.status}</span>
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

  return {
    props: { hashtag: hashtag ? JSON.parse(JSON.stringify(hashtag, null, 2)) : null },
    revalidate: 300,
    notFound: !hashtag,
  };
}
