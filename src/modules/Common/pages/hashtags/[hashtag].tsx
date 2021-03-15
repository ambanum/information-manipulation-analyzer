import React from 'react';
import dayjs from 'dayjs';
import Layout from 'modules/Embassy/components/Layout';
import Link from 'next/link';
import useSWR from 'swr';
import VolumetryGraph, {
  VolumetryGraphOptions,
  VolumetryGraphProps,
} from '../../components/Charts/VolumetryGraph';
import LanguageGraph, {
  LanguageGraphProps,
  LanguageGraphOptions,
} from '../../components/Charts/LanguageGraph';
import UsernameTable, { UsernameTableProps } from '../../components/Datatables/UsernameTable';
import { GetHashtagResponse, Hashtag } from '../../interfaces';
export { default as getStaticProps } from './[hashtag].staticProps';
export { default as getStaticPaths } from './[hashtag].staticPaths';
const shouldPoll = (status: string) => ['DONE', 'DONE_ERROR', 'DONE_FIRST_FETCH'].includes(status);

export default function HashtagPage({
  hashtag,
  volumetry,
  languages,
  usernames,
}: {
  hashtag: Hashtag;
  volumetry: VolumetryGraphProps['data'];
  languages: LanguageGraphProps['data'];
  usernames: UsernameTableProps['data'];
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
        <div style={{ height: '400px', width: '100%' }}>
          <LanguageGraph data={languages} options={{ onClick: onPieClick }} />
        </div>
      )}
      {usernames?.length > 0 && (
        <div className="rf-container">
          <div className="rf-grid-row">
            <div className="rf-col-6">
              <UsernameTable data={usernames} />
            </div>
            <div className="rf-col-6"></div>
          </div>
        </div>
      )}
    </Layout>
  );
}
