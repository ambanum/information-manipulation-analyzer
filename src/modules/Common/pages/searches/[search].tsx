import { getTweetIntentLink, getTwitterLink } from 'utils/twitter';

import Breadcrumb from 'modules/Common/components/Breadcrumb/Breadcrumb';
import BreadcrumbItem from 'modules/Common/components/Breadcrumb/BreadcrumbItem';
import Card from 'components/Card';
import { GetSearchResponse } from '../../interfaces';
import { HashtagTableProps } from '../../components/Datatables/HashtagTable.d';
import { LanguageGraphProps } from '../../components/Charts/LanguageGraph.d';
import Layout from 'modules/Embassy/components/Layout';
import Loading from 'components/Loading';
import React from 'react';
import { UsernameTableProps } from '../../components/Datatables/UsernameTable.d';
import { VolumetryGraphProps } from '../../components/Charts/VolumetryGraph.d';
import api from 'utils/api';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
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

export { default as getStaticPaths } from './[search].staticPaths';
export { default as getStaticProps } from './[search].staticProps';

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

const SearchPage = ({
  search: defaultSearch,
  volumetry: defaultVolumetry,
  languages: defaultLanguages,
  usernames: defaultUsernames,
  nbUsernames: defaultNbUsernames,
  totalNbTweets: defaultTotalNbTweets,
  associatedHashtags: defaultAssociatedHashtags,
  nbAssociatedHashtags: defaultNbAssociatedHashtags,
}: {
  search: GetSearchResponse['search'];
  totalNbTweets: GetSearchResponse['totalNbTweets'];
  volumetry: GetSearchResponse['volumetry'];
  languages: GetSearchResponse['languages'];
  usernames: GetSearchResponse['usernames'];
  nbUsernames: GetSearchResponse['nbUsernames'];
  associatedHashtags: GetSearchResponse['associatedHashtags'];
  nbAssociatedHashtags: GetSearchResponse['nbAssociatedHashtags'];
}) => {
  const router = useRouter();
  const searchName = defaultSearch?.name || router.query.search;

  const [loadingData, toggleLoadingData] = useToggle(true);
  const { queryParams, pushQueryParams, queryParamsStringified } = useUrl();

  const [refreshInterval, setRefreshInterval] = React.useState(
    REFRESH_INTERVALS[defaultSearch?.status]
  );

  const { data, isValidating } = useSWR<GetSearchResponse>(
    `/api/searches/${encodeURIComponent(searchName as string)}${queryParamsStringified}`,
    {
      initialData: {
        status: 'ok',
        message: '',
        search: defaultSearch,
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
    totalNbTweets = 0,
    volumetry = [],
    languages = [],
    usernames = [],
    nbUsernames = 0,
    associatedHashtags = [],
    nbAssociatedHashtags = 0,
  } = data || {};
  const {
    status = '',
    metadata,
    type,
    firstOccurenceDate,
    oldestProcessedDate,
    newestProcessedDate,
  } = data?.search || {};

  const gatheringData = ['PROCESSING', 'PENDING'].includes(status);

  const onLineClick: VolumetryGraphProps['onClick'] = React.useCallback(
    (scale, point) => {
      window.open(
        getTwitterLink(`${searchName}`, { date: point.data.x as any, asTime: scale === 'hour' })
      );
    },
    [searchName]
  );

  const onPieClick: LanguageGraphProps['onSliceClick'] = React.useCallback(
    ({ id: lang }) => {
      window.open(getTwitterLink(`${searchName}`, { lang: lang as string }));
    },
    [searchName]
  );

  const onUsernameClick: UsernameTableProps['onUsernameClick'] = React.useCallback(
    (username: string) => {
      window.open(getTwitterLink(`${searchName}`, { username }));
    },
    [searchName]
  );

  const onHashtagClick: HashtagTableProps['onHashtagClick'] = React.useCallback(
    (newHashtagName: string) => {
      window.open(getTwitterLink(`${newHashtagName}`, {}));
    },
    [searchName]
  );

  const onHashtagSearchClick: HashtagTableProps['onHashtagSearchClick'] = React.useCallback(
    async (hashtagWithoutHash: string) => {
      const lowerCasedSearchName = `#${hashtagWithoutHash.toLowerCase()}`;
      if (searchName === lowerCasedSearchName) {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
        return;
      }
      await api.post('/api/searches', { name: lowerCasedSearchName });
      router.push(
        `/searches/${encodeURIComponent(lowerCasedSearchName)}?fromhashtag=${searchName}`
      );
    },
    [searchName]
  );

  const onUsernameSearchClick: UsernameTableProps['onUsernameClick'] = React.useCallback(
    (username: string) => {
      router.push(`/user/@${username}?fromhashtag=${searchName}`);
    },
    [searchName]
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

  const isUrl = type === 'URL';
  const title = isUrl ? (
    <a href={searchName as string} target="_blank">
      Article
    </a>
  ) : (
    searchName
  );

  return (
    <Layout
      title={`${isUrl ? metadata?.url?.title : searchName} | Information Manipulation Analyzer`}
    >
      <div className="fr-container fr-mb-12w">
        <div className="fr-grid-row">
          <div className="fr-col">
            <h6 className="text-center">
              Information Manipulation Analyzer
              <sup>
                <span
                  style={{
                    background: 'var(--rm500)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  className="fr-tag fr-tag--sm fr-ml-1w"
                >
                  BETA
                </span>
              </sup>
            </h6>
            <h1 className="text-center">{title}</h1>
            {status === 'PENDING' && (
              <div className="text-center fr-my-12w">
                <span className="fr-tag">Your request is in the queue and will begin shortly</span>
              </div>
            )}
            {status === 'PROCESSING' && (
              <div className="text-center fr-my-12w">
                <span className="fr-tag">
                  Data is being extracted from twitter, please be patient
                </span>
              </div>
            )}
            {status === 'DONE_ERROR' && (
              <div className="text-center fr-my-12w">
                <span className="fr-text-color--error">
                  An error occured and processing stopped, please contact the administrator if you
                  need more data on this hashtag
                </span>
              </div>
            )}
            {type === 'URL' && (
              <Card
                horizontal
                enlargeLink
                direction="right"
                style={{ maxHeight: '260px', marginBottom: '20px' }}
                href={searchName as string}
                title={metadata?.url?.title}
                detail={metadata?.url?.site}
                description={metadata?.url?.description}
                image={metadata?.url?.image?.url}
                imageAlt={metadata?.url?.title}
              />
            )}
            {(gatheringData || router.isFallback) && <Loading />}
          </div>
        </div>

        <>
          {status === 'PROCESSING_PREVIOUS' && (
            <Loading size="sm" className="text-center fr-my-2w" />
          )}

          <div className="text-center fr-text--xs fr-text-color--g500">
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

        <Breadcrumb>
          <BreadcrumbItem href="/">All searches</BreadcrumbItem>
          {queryParams.fromsearch && (
            <BreadcrumbItem href={`/searches/${encodeURIComponent(queryParams.fromsearch)}`}>
              {queryParams.fromsearch}
            </BreadcrumbItem>
          )}
          <BreadcrumbItem isCurrent={true}>{searchName}</BreadcrumbItem>
        </Breadcrumb>

        {totalNbTweets > 0 && (
          <div className="fr-container fr-container-fluid fr-my-6w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col">
                <Card
                  horizontal
                  title={
                    firstOccurenceDate ? dayjs(firstOccurenceDate).format('lll') : 'Searching...'
                  }
                  href={getTwitterLink(`${searchName}`, { endDate: firstOccurenceDate })}
                  description={'Date of first appearance'}
                />
              </div>
              <div className="fr-col">
                <Card
                  horizontal
                  title={!gatheringData && !loadingData ? nbUsernames.toLocaleString('en') : '-'}
                  description={'Nb Active users'}
                  noArrow
                  loading={loadingData}
                />
              </div>
              <div className="fr-col">
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
              <div className="fr-col">
                <Card
                  horizontal
                  title={!gatheringData && !loadingData ? totalNbTweets.toLocaleString('en') : '-'}
                  description={'Total Tweets'}
                  noArrow
                  loading={loadingData}
                />
              </div>
              <div className="fr-col">
                <Card
                  horizontal
                  title={'I want this!'}
                  description={'Inauthenticity Probability'}
                  href={getTweetIntentLink(
                    `Hey @AmbNum, I absolutely need to retrieve the inauthenticity probability on a search on IMA. Thanks`
                  )}
                />
              </div>
            </div>
          </div>
        )}
        {totalNbTweets === 0 && status === 'DONE' && (
          <h4 className="text-center fr-mb-12w fr-text-color--os500">
            Sorry, we did not found any data for this
          </h4>
        )}

        {volumetry[0]?.data?.length > 0 && (
          <div className="fr-my-6w">
            <VolumetryGraph
              data={volumetry}
              defaultValues={queryParams}
              onPointClick={onLineClick}
              onFilterDateChange={onFilterDateChange}
            />
          </div>
        )}
        {languages?.length > 0 && (
          <div
            className="fr-my-6w"
            style={{ height: '400px', margin: '0 auto', opacity: loadingData ? 0.3 : 1 }}
          >
            <LanguageGraph data={languages} onSliceClick={onPieClick} />
          </div>
        )}
        {usernames?.length > 0 && (
          <div
            className="fr-container fr-container-fluid fr-my-6w"
            style={{ opacity: loadingData ? 0.3 : 1 }}
          >
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col">
                <UsernameTable
                  nbData={nbUsernames}
                  data={usernames}
                  onUsernameClick={onUsernameClick}
                  onUsernameSearchClick={onUsernameSearchClick}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__usernames`}
                />
                <HashtagTable
                  nbData={nbAssociatedHashtags}
                  data={associatedHashtags}
                  onHashtagClick={onHashtagClick}
                  onHashtagSearchClick={onHashtagSearchClick}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__associated-hashtags`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
