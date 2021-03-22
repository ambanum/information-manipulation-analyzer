import LanguageGraph, { LanguageGraphProps } from '../../components/Charts/LanguageGraph';
import UsernameTable, { UsernameTableProps } from '../../components/Datatables/UsernameTable';
import VolumetryGraph, { VolumetryGraphProps } from '../../components/Charts/VolumetryGraph';

import Card from 'components/Card';
import { GetHashtagResponse } from '../../interfaces';
import HashtagTable from '../../components/Datatables/HashtagTable';
import Layout from 'modules/Embassy/components/Layout';
import Link from 'next/link';
import Loading from 'components/Loading';
import React from 'react';
import dayjs from 'dayjs';
import { getTwitterLink } from 'utils/twitter';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import useSWR from 'swr';

export { default as getStaticPaths } from './[hashtag].staticPaths';
export { default as getStaticProps } from './[hashtag].staticProps';
const shouldNotPoll = (status: string) =>
  ['DONE', 'DONE_ERROR', 'DONE_FIRST_FETCH'].includes(status);

const REFRESH_INTERVALS = {
  PROCESSING_PREVIOUS: 60 * 1 * 1000,
  DONE: 0,
  DONE_ERROR: 0,
  DONE_FIRST_FETCH: 0,
  PENDING: 5 * 1000,
  PROCESSING: 3 * 1000,
  '': 5 * 1000,
};

dayjs.extend(localizedFormat);

const HashtagPage = ({
  hashtag: defaultHashtag,
  volumetry: defaultVolumetry,
  languages: defaultLanguages,
  usernames: defaultUsernames,
  totalNbTweets: defaultTotalNbTweets,
  associatedHashtags: defaultAssociatedHashtags,
}: {
  hashtag: GetHashtagResponse['hashtag'];
  totalNbTweets: GetHashtagResponse['totalNbTweets'];
  volumetry: GetHashtagResponse['volumetry'];
  languages: GetHashtagResponse['languages'];
  usernames: GetHashtagResponse['usernames'];
  associatedHashtags: GetHashtagResponse['associatedHashtags'];
}) => {
  const [skip, setSkip] = React.useState(shouldNotPoll(defaultHashtag?.status));
  const [refreshInterval, setRefreshInterval] = React.useState(
    REFRESH_INTERVALS[defaultHashtag?.status]
  );
  const { data } = useSWR<GetHashtagResponse>(`/api/hashtags/${defaultHashtag.name}`, {
    initialData: {
      status: 'ok',
      message: '',
      hashtag: defaultHashtag,
      totalNbTweets: defaultTotalNbTweets,
      volumetry: defaultVolumetry,
      languages: defaultLanguages,
      usernames: defaultUsernames,
      associatedHashtags: defaultAssociatedHashtags,
    },
    refreshInterval: refreshInterval,
    isPaused: () => skip,
  });

  const {
    hashtag,
    totalNbTweets = 0,
    volumetry = [],
    languages = [],
    usernames = [],
    associatedHashtags = [],
  } = data || {};
  const { status = '', firstOccurenceDate, oldestProcessedDate, newestProcessedDate } =
    data?.hashtag || {};
  const loading = ['PROCESSING', 'PENDING'].includes(status);

  const onLineClick: VolumetryGraphProps['onClick'] = React.useCallback(
    (point) => {
      window.open(getTwitterLink(hashtag?.name, { date: point.data.x as any }));
    },
    [hashtag?.name]
  );

  const onPieClick: LanguageGraphProps['onClick'] = React.useCallback(
    ({ id: lang }) => {
      window.open(getTwitterLink(hashtag?.name, { lang: lang as string }));
    },
    [hashtag?.name]
  );

  const onUsernameClick: UsernameTableProps['onUsernameClick'] = React.useCallback(
    (username: string) => {
      window.open(getTwitterLink(hashtag?.name, { username }));
    },
    [hashtag?.name]
  );

  React.useEffect(() => {
    const newSkip = shouldNotPoll(status);
    setSkip(newSkip);
    setRefreshInterval(REFRESH_INTERVALS[status]);
  }, [status]);

  return (
    <Layout title={`#${hashtag?.name} | Information Manipulation Analyzer`}>
      <div className="rf-container rf-mb-12w">
        <div className="rf-grid-row">
          <div className="rf-col">
            <div className="text-center rf-myw">
              <Link href="/">
                <a className="rf-link rf-fi-arrow-left-line rf-link--icon-left">Back</a>
              </Link>
            </div>
            <h1 className="text-center">#{hashtag?.name}</h1>
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
            {loading && <Loading />}
          </div>
        </div>
        {status === 'PROCESSING_PREVIOUS' && (
          <>
            <Loading size="sm" className="text-center rf-mt-2w" />

            <div className="text-center rf-text--xs rf-text-color--g500">
              <em>
                Last crawled date:{' '}
                {oldestProcessedDate ? dayjs(oldestProcessedDate).format('lll') : 'Searching...'}
              </em>
            </div>
          </>
        )}
        {newestProcessedDate && (
          <div className="text-center rf-text--xs rf-text-color--g500">
            <em>Most recent crawled date: {dayjs(newestProcessedDate).format('lll')}</em>
          </div>
        )}
      </div>
      <div className="rf-container rf-container-fluid">
        <div className="rf-grid-row rf-grid-row--gutters">
          <div className="rf-col">
            <Card
              horizontal
              title={firstOccurenceDate ? dayjs(firstOccurenceDate).format('lll') : 'Searching...'}
              href={getTwitterLink(hashtag?.name, { endDate: firstOccurenceDate })}
              description={'Date of first appearance'}
            />
          </div>
          <div className="rf-col">
            <Card
              horizontal
              title={!loading ? usernames.length.toLocaleString('en') : '-'}
              description={'Nb Active users'}
              noArrow
            />
          </div>
          <div className="rf-col">
            <Card
              horizontal
              title={!loading ? associatedHashtags.length.toLocaleString('en') : '-'}
              description={'Nb Associated hashtags'}
              noArrow
            />
          </div>
          <div className="rf-col">
            <Card
              horizontal
              title={!loading ? totalNbTweets.toLocaleString('en') : '-'}
              description={'Total Tweets'}
              noArrow
            />
          </div>
          <div className="rf-col">
            <Card
              horizontal
              title={'TODO %'}
              description={'Inauthenticity Probability'}
              href={'#calculation-algorythm'}
            />
          </div>
        </div>
      </div>
      {volumetry[0]?.data?.length > 0 && (
        <div style={{ height: '600px', width: '100%', margin: '0 auto' }}>
          <VolumetryGraph data={volumetry} onClick={onLineClick} />
        </div>
      )}
      {languages?.length > 0 && (
        <div style={{ height: '400px', width: '100%', margin: '0 auto' }}>
          <LanguageGraph data={languages} onClick={onPieClick} />
        </div>
      )}
      {usernames?.length > 0 && (
        <div className="rf-container rf-container-fluid">
          <div className="rf-grid-row rf-grid-row--gutters">
            <div className="rf-col-6">
              <UsernameTable data={usernames} onUsernameClick={onUsernameClick} />
            </div>
            <div className="rf-col-6">
              <HashtagTable data={associatedHashtags} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HashtagPage;
