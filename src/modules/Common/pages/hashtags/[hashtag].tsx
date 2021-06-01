import Card from 'components/Card';
import { GetHashtagResponse } from '../../interfaces';
import { HashtagTableProps } from '../../components/Datatables/HashtagTable.d';
import { LanguageGraphProps } from '../../components/Charts/LanguageGraph.d';
import Layout from 'modules/Embassy/components/Layout';
import Link from 'next/link';
import Loading from 'components/Loading';
import React from 'react';
import { UsernameTableProps } from '../../components/Datatables/UsernameTable.d';
import { VolumetryGraphProps } from '../../components/Charts/VolumetryGraph.d';
import api from 'utils/api';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import { getTwitterLink } from 'utils/twitter';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useToggle } from 'react-use';
import useUrl from 'hooks/useUrl';

const HashtagTable = dynamic(() => import('../../components/Datatables/HashtagTable'), {
  loading: () => <Loading />,
  ssr: false,
});
const LanguageGraph = dynamic(() => import('../../components/Charts/LanguageGraph'), {
  loading: () => <Loading />,
  ssr: false,
});
const UsernameTable = dynamic(() => import('../../components/Datatables/UsernameTable'), {
  loading: () => <Loading />,
  ssr: false,
});
const VolumetryGraph = dynamic(() => import('../../components/Charts/VolumetryGraph'), {
  loading: () => <Loading />,
  ssr: false,
});

export { default as getStaticPaths } from './[hashtag].staticPaths';
export { default as getStaticProps } from './[hashtag].staticProps';

const REFRESH_INTERVALS = {
  PROCESSING_PREVIOUS: 60 * 1 * 1000,
  DONE: 60 * 60 * 1 * 1000,
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
  nbUsernames: defaultNbUsernames,
  totalNbTweets: defaultTotalNbTweets,
  associatedHashtags: defaultAssociatedHashtags,
  nbAssociatedHashtags: defaultNbAssociatedHashtags,
}: {
  hashtag: GetHashtagResponse['hashtag'];
  totalNbTweets: GetHashtagResponse['totalNbTweets'];
  volumetry: GetHashtagResponse['volumetry'];
  languages: GetHashtagResponse['languages'];
  usernames: GetHashtagResponse['usernames'];
  nbUsernames: GetHashtagResponse['nbUsernames'];
  associatedHashtags: GetHashtagResponse['associatedHashtags'];
  nbAssociatedHashtags: GetHashtagResponse['nbAssociatedHashtags'];
}) => {
  const router = useRouter();
  const [loadingData, toggleLoadingData] = useToggle(true);
  const { queryParams, pushQueryParams, queryParamsStringified } = useUrl();

  const [refreshInterval, setRefreshInterval] = React.useState(
    REFRESH_INTERVALS[defaultHashtag?.status]
  );

  const { data, isValidating } = useSWR<GetHashtagResponse>(
    `/api/hashtags/${defaultHashtag.name}${queryParamsStringified}`,
    {
      initialData: {
        status: 'ok',
        message: '',
        hashtag: defaultHashtag,
        totalNbTweets: defaultTotalNbTweets,
        volumetry: defaultVolumetry,
        languages: defaultLanguages,
        usernames: defaultUsernames,
        nbUsernames: defaultNbUsernames,
        associatedHashtags: defaultAssociatedHashtags,
        nbAssociatedHashtags: defaultNbAssociatedHashtags,
      },
      refreshInterval,
      revalidateOnMount: true,
    }
  );

  React.useEffect(() => {
    toggleLoadingData(isValidating);
  }, [isValidating]);

  const {
    hashtag,
    totalNbTweets = 0,
    volumetry = [],
    languages = [],
    usernames = [],
    nbUsernames = 0,
    associatedHashtags = [],
    nbAssociatedHashtags = 0,
  } = data || {};
  const { status = '', firstOccurenceDate, oldestProcessedDate, newestProcessedDate } =
    data?.hashtag || {};

  const gatheringData = ['PROCESSING', 'PENDING'].includes(status);

  const onLineClick: VolumetryGraphProps['onClick'] = React.useCallback(
    (point) => {
      window.open(getTwitterLink(`#${hashtag?.name}`, { date: point.data.x as any }));
    },
    [hashtag?.name]
  );

  const onPieClick: LanguageGraphProps['onSliceClick'] = React.useCallback(
    ({ id: lang }) => {
      window.open(getTwitterLink(`#${hashtag?.name}`, { lang: lang as string }));
    },
    [hashtag?.name]
  );

  const onUsernameClick: UsernameTableProps['onUsernameClick'] = React.useCallback(
    (username: string) => {
      window.open(getTwitterLink(`#${hashtag?.name}`, { username }));
    },
    [hashtag?.name]
  );

  const onHashtagClick: HashtagTableProps['onHashtagClick'] = React.useCallback(
    (newHashtagName: string) => {
      window.open(getTwitterLink(`#${newHashtagName}`, {}));
    },
    [hashtag?.name]
  );

  const onHashtagSearchClick: HashtagTableProps['onHashtagSearchClick'] = React.useCallback(
    async (newHashtagName: string) => {
      await api.post('/api/hashtags', { name: newHashtagName });
      router.push(`/hashtags/${newHashtagName}?fromhashtag=${hashtag?.name}`);
    },
    [hashtag?.name]
  );

  const onFilterDateChange: any = React.useCallback(
    debounce(async (data: any) => {
      if (queryParams.min !== `${data.min}` && queryParams.max !== `${data.max}`) {
        toggleLoadingData(true);
        pushQueryParams({ ...router.query, ...data }, undefined, { scroll: false });
      }
    }, 500),
    [queryParams.min, queryParams.max]
  );

  React.useEffect(() => {
    setRefreshInterval(REFRESH_INTERVALS[status]);
  }, [status]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.reset();
    alert('Sorry, this feature is not ready yet');
  };

  return (
    <Layout title={`#${hashtag?.name} | Information Manipulation Analyzer`}>
      <div className="rf-container rf-mb-12w">
        <div className="rf-grid-row">
          <div className="rf-col">
            <div className="text-center rf-myw">
              <Link href="/">
                <a className="rf-link rf-fi-arrow-left-line rf-link--icon-left">All hashtags</a>
              </Link>
              {queryParams.fromhashtag && (
                <Link href={`/hashtags/${queryParams.fromhashtag}`}>
                  <a className="rf-link rf-fi-arrow-left-line rf-link--icon-left">
                    #{queryParams.fromhashtag}
                  </a>
                </Link>
              )}
            </div>
            <h1 className="text-center">#{hashtag?.name}</h1>
            <h6 className="text-center">
              Information Manipulation Analyzer
              <sup>
                <span
                  style={{
                    background: 'var(--rm500)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  className="rf-tag rf-tag--sm"
                >
                  BETA
                </span>
              </sup>
            </h6>
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
            {status === 'DONE_ERROR' && (
              <div className="text-center rf-my-12w">
                <span className="rf-text-color--error">
                  An error occured and processing stopped, please contact the administrator if you
                  need more data on this hashtag
                </span>
              </div>
            )}
            {gatheringData && <Loading />}
          </div>
        </div>

        <>
          {status === 'PROCESSING_PREVIOUS' && (
            <Loading size="sm" className="text-center rf-my-2w" />
          )}

          <div className="text-center rf-text--xs rf-text-color--g500">
            <em>
              {status !== 'PENDING' ? 'Crawled' : ''}
              {status === 'PROCESSING_PREVIOUS' && (
                <>
                  {' '}
                  from{' '}
                  <strong>
                    {oldestProcessedDate
                      ? dayjs(oldestProcessedDate).format('llll')
                      : 'Searching...'}
                  </strong>
                </>
              )}
              {newestProcessedDate && (
                <>
                  {' '}
                  until{' '}
                  <strong>
                    {newestProcessedDate
                      ? dayjs(newestProcessedDate).format('llll')
                      : 'Searching...'}
                  </strong>
                </>
              )}
            </em>
          </div>
        </>
        {totalNbTweets > 0 && (
          <div className="rf-container rf-container-fluid">
            <div className="rf-grid-row rf-grid-row--gutters">
              <div className="rf-col">
                <Card
                  horizontal
                  title={
                    firstOccurenceDate ? dayjs(firstOccurenceDate).format('lll') : 'Searching...'
                  }
                  href={getTwitterLink(`#${hashtag?.name}`, { endDate: firstOccurenceDate })}
                  description={'Date of first appearance'}
                />
              </div>
              <div className="rf-col">
                <Card
                  horizontal
                  title={!gatheringData && !loadingData ? nbUsernames.toLocaleString('en') : '-'}
                  description={'Nb Active users'}
                  noArrow
                  loading={loadingData}
                />
              </div>
              <div className="rf-col">
                <Card
                  horizontal
                  title={
                    !gatheringData && !loadingData ? nbAssociatedHashtags.toLocaleString('en') : '-'
                  }
                  description={'Nb Associated hashtags'}
                  noArrow
                  loading={loadingData}
                />
              </div>
              <div className="rf-col">
                <Card
                  horizontal
                  title={!gatheringData && !loadingData ? totalNbTweets.toLocaleString('en') : '-'}
                  description={'Total Tweets'}
                  noArrow
                  loading={loadingData}
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
        )}
        {totalNbTweets === 0 && status === 'DONE' && (
          <h4 className="text-center rf-mb-12w rf-text-color--os500">
            Sorry, we did not found any data for this
          </h4>
        )}

        {volumetry[0]?.data?.length > 0 && (
          <div style={{ margin: '20px auto' }}>
            <VolumetryGraph
              data={volumetry}
              defaultValues={queryParams}
              onPointClick={onLineClick}
              onFilterDateChange={onFilterDateChange}
            />
          </div>
        )}
        {languages?.length > 0 && (
          <div style={{ height: '400px', margin: '20px auto', opacity: loadingData ? 0.3 : 1 }}>
            <LanguageGraph data={languages} onSliceClick={onPieClick} />
          </div>
        )}
        {usernames?.length > 0 && (
          <div
            className="rf-container rf-container-fluid"
            style={{ opacity: loadingData ? 0.3 : 1 }}
          >
            <div className="rf-grid-row rf-grid-row--gutters">
              <div className="rf-col-md-6">
                <UsernameTable
                  nbData={nbUsernames}
                  data={usernames}
                  onUsernameClick={onUsernameClick}
                  exportName={`${dayjs(newestProcessedDate).format('YYYYMMDDHH')}__${
                    hashtag?.name
                  }__usernames`}
                />
              </div>
              <div className="rf-col-md-6">
                <HashtagTable
                  nbData={nbAssociatedHashtags}
                  data={associatedHashtags}
                  onHashtagClick={onHashtagClick}
                  onHashtagSearchClick={onHashtagSearchClick}
                  exportName={`${dayjs(newestProcessedDate).format('YYYYMMDDHH')}__${
                    hashtag?.name
                  }__associated-hashtags`}
                />
              </div>
            </div>
          </div>
        )}
        <div className="rf-highlight rf-highlight--sm">
          <form onSubmit={handleSubmit}>
            <div className="rf-input-group">
              <label className="rf-label" htmlFor="text-input-hint">
                Be alerted by email
                <span className="rf-hint-text">
                  Whenever <strong>#{hashtag?.name}</strong> has an abnormal rise in number of
                  tweets
                </span>
              </label>
              <input
                className="rf-input"
                type="email"
                id="text-input-hint"
                name="text-input-hint"
                placeholder="Enter your email here"
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default HashtagPage;
