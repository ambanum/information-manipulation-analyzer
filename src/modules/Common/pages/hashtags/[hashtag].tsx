import React from 'react';
import dayjs from 'dayjs';
import Layout from 'modules/Embassy/components/Layout';
import { GetStaticPaths } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import dbConnect from 'utils/db';
import VolumetryGraph, {
  VolumetryGraphOptions,
  VolumetryGraphProps,
} from '../../components/Charts/VolumetryGraph';
import LanguageGraph, {
  LanguageGraphProps,
  LanguageGraphOptions,
} from '../../components/Charts/LanguageGraph';
import { GetHashtagResponse, Hashtag } from '../../interfaces';
import * as HashtagManager from '../../managers/HashtagManager';

const shouldPoll = (status: string) => ['DONE', 'DONE_ERROR', 'DONE_FIRST_FETCH'].includes(status);

export default function HashtagPage({
  hashtag,
  volumetry,
  languages,
}: {
  hashtag: Hashtag;
  volumetry: VolumetryGraphProps['data'];
  languages: LanguageGraphProps['data'];
}) {
  const [skip, setSkip] = React.useState(shouldPoll(hashtag?.status));
  const { data } = useSWR<GetHashtagResponse>(`/api/hashtags/${hashtag.name}`, {
    initialData: { status: 'ok', message: '', hashtag },
    refreshInterval: 3000,
    isPaused: () => skip,
  });

  const { status = '' } = data?.hashtag || {};

  const onLineClick: VolumetryGraphOptions['onClick'] = (point) => {
    const startDate = dayjs(point.data.x).startOf('day').format('YYYY-MM-DD');
    const endDate = dayjs(point.data.x).add(1, 'day').startOf('day').format('YYYY-MM-DD');
    window.open(
      `https://twitter.com/search?q=${hashtag.name}%20until%3A${endDate}%20%20since%3A${startDate}&src=typed_query`
    );
  };

  const onPieClick: LanguageGraphOptions['onClick'] = ({ id: lang }) => {
    window.open(`https://twitter.com/search?q=${hashtag.name}%20lang%3A${lang}`);
  };

  React.useEffect(() => {
    setSkip(shouldPoll(status));
  }, [status]);

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
            {status === 'PENDING' && (
              <div className="text-center rf-my-12w">
                <span className="rf-tag">Your request is in the queue and will begin shortly</span>
              </div>
            )}
            {status === 'PROCESSING' && (
              <div className="text-center rf-my-12w">
                <span className="rf-tag">
                  Data is being extracted from twitter, please be patient
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {volumetry[0]?.data?.length > 0 && (
        <div style={{ height: '600px', width: '100%' }}>
          <VolumetryGraph data={volumetry} options={{ onClick: onLineClick }} />
        </div>
      )}
      {languages?.length > 0 && (
        <div style={{ height: '300px', width: '100%' }}>
          <LanguageGraph data={languages} options={{ onClick: onPieClick }} />
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

  const usernames: { [key: string]: number } = {};
  const languages: { [key: string]: number } = {};

  const volumetry = hashtag.volumetry.reduce(
    (acc: VolumetryGraphProps['data'], volumetry) => {
      const newAcc = [...acc];
      newAcc[0].data.push({ x: volumetry.date, y: volumetry.nbTweets || 0 });
      newAcc[1].data.push({ x: volumetry.date, y: volumetry.nbRetweets || 0 });
      newAcc[2].data.push({ x: volumetry.date, y: volumetry.nbLikes || 0 });
      newAcc[3].data.push({ x: volumetry.date, y: volumetry.nbQuotes || 0 });
      Object.keys(volumetry.languages).forEach((language) => {
        languages[language] = (languages[language] || 0) + volumetry.languages[language];
      });
      Object.keys(volumetry.usernames).forEach((username) => {
        usernames[username] = (usernames[username] || 0) + volumetry.usernames[username];
      });
      return acc;
    },
    [
      { id: 'nbTweets', data: [] },
      { id: 'nbRetweets', data: [] },
      { id: 'nbLikes', data: [] },
      { id: 'nbQuotes', data: [] },
    ]
  );

  return {
    props: {
      hashtag: hashtag ? JSON.parse(JSON.stringify(hashtag, null, 2)) : null,
      volumetry: JSON.parse(JSON.stringify(volumetry, null, 2)),
      usernames: JSON.parse(
        JSON.stringify(
          Object.keys(usernames).reduce(
            (acc: any[], username: string) => [
              ...acc,
              {
                id: username,
                label: username,
                value: usernames[username],
              },
            ],
            []
          ),
          null,
          2
        )
      ),
      languages: JSON.parse(
        JSON.stringify(
          Object.keys(languages).reduce(
            (acc: any[], language: string) => [
              ...acc,
              {
                id: language,
                label: language,
                value: languages[language],
              },
            ],
            []
          ),
          null,
          2
        )
      ),
    },
    revalidate: 300,
    notFound: !hashtag,
  };
}
