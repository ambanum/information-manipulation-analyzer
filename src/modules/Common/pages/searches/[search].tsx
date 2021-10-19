import 'react-tabs/style/react-tabs.css';

import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import Alert from 'modules/Common/components/Alert/Alert';
import Breadcrumb from 'modules/Common/components/Breadcrumb/Breadcrumb';
import BreadcrumbItem from 'modules/Common/components/Breadcrumb/BreadcrumbItem';
import { GetSearchResponse } from '../../interfaces';
import { HashtagTableProps } from '../../components/Datatables/HashtagTable.d';
import Hero from 'modules/Common/components/Hero/Hero';
import { LanguageTableProps } from 'modules/Common/components/Datatables/LanguageTable.d';
import Layout from 'modules/Embassy/components/Layout';
import Loading from 'components/Loading';
import Overview from 'modules/Common/components/Overview/Overview';
import React from 'react';
import Tile from 'modules/Common/components/Tile/Tile';
import UrlFilters from 'modules/Common/data-components/UrlFilters';
import { UsernameTableProps } from '../../components/Datatables/UsernameTable.d';
import { VolumetryGraphProps } from '../../components/Charts/VolumetryGraph.d';
import api from 'utils/api';
import classNames from 'classnames';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import { getTwitterLink } from 'utils/twitter';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import sReactTabs from 'modules/Embassy/styles/react-tabs.module.css';
import { useRouter } from 'next/router';
import useSplitSWR from 'hooks/useSplitSWR';
import useUrl from 'hooks/useUrl';

const ssrConfig = {
  loading: () => <Loading />,
  ssr: false,
};

const LanguageData = dynamic(() => import('../../data-components/Language'), ssrConfig);
const HashtagData = dynamic(() => import('../../data-components/Hashtag'), ssrConfig);
const UsernameData = dynamic(() => import('../../data-components/Username'), ssrConfig);
const VolumetryGraph = dynamic(() => import('../../components/Charts/VolumetryGraph'), ssrConfig);
const TweetsData = dynamic(() => import('../../data-components/Tweets'), ssrConfig);
const VideosData = dynamic(() => import('../../data-components/Videos'), ssrConfig);
const PhotosData = dynamic(() => import('../../data-components/Photos'), ssrConfig);
const OutlinksData = dynamic(() => import('../../data-components/Outlinks'), ssrConfig);

export { default as getStaticPaths } from './[search].staticPaths';
export { default as getStaticProps } from './[search].staticProps';

const REFRESH_INTERVALS = {
  PROCESSING_PREVIOUS: 60 * 1000,
  DONE: 60 * 60 * 1000,
  DONE_ERROR: 0,
  DONE_FIRST_FETCH: 0,
  PENDING: 5 * 1000,
  PROCESSING: 15 * 1000,
  '': 5 * 1000,
};

dayjs.extend(localizedFormat);

const SearchPage = ({
  search: defaultSearch,
  volumetry: defaultVolumetry,
  nbUsernames: defaultNbUsernames,
  nbTweets: defaultNbTweets,
  nbRetweets: defaultNbReweets,
  nbLikes: defaultNbLikes,
  nbReplies: defaultNbReplies,
  nbQuotes: defaultNbQuotes,
  nbAssociatedHashtags: defaultNbAssociatedHashtags,
}: {
  search: GetSearchResponse['search'];
  nbTweets: GetSearchResponse['nbTweets'];
  nbRetweets: GetSearchResponse['nbRetweets'];
  nbLikes: GetSearchResponse['nbLikes'];
  nbReplies: GetSearchResponse['nbReplies'];
  nbQuotes: GetSearchResponse['nbQuotes'];
  volumetry: GetSearchResponse['volumetry'];
  nbUsernames: GetSearchResponse['nbUsernames'];
  nbAssociatedHashtags: GetSearchResponse['nbAssociatedHashtags'];
}) => {
  const router = useRouter();

  // For an unknown reason, router.query.search is empty on first call
  // surely due to getStaticProps but could not figure the exact why
  const searchNameFromUrl = decodeURIComponent(
    router.asPath.replace('/searches/', '').replace(/\?.*/gim, '')
  );

  const searchName = defaultSearch?.name || (router.query.search as string);

  const { queryParams, pushQueryParams, queryParamsStringified } = useUrl();

  const [refreshInterval, setRefreshInterval] = React.useState(
    REFRESH_INTERVALS[defaultSearch?.status || '']
  );

  const { data, loading, error } = useSplitSWR(
    searchName
      ? `/api/searches/${encodeURIComponent(searchName as string)}/split${queryParamsStringified}`
      : null,
    {
      initialData: {
        status: 'ok',
        message: '',
        nbLoaded: -1,
        nbToLoad: -1,
        search: defaultSearch,
        totalNbTweets: defaultNbTweets,
        totalNbRetweets: defaultNbReweets,
        totalNbLikes: defaultNbLikes,
        totalNbReplies: defaultNbReplies,
        totalNbQuotes: defaultNbQuotes,
        totalNbUsernames: defaultNbUsernames,
        totalNbAssociatedHashtags: defaultNbAssociatedHashtags,
        nbTweets: 0,
        nbRetweets: 0,
        nbLikes: 0,
        nbReplies: 0,
        nbQuotes: 0,
        volumetry: defaultVolumetry,
        nbUsernames: 0,
        nbAssociatedHashtags: 0,
      },
      refreshInterval,
      dedupingInterval: refreshInterval,
      // revalidateOnMount: false, if we do this, we will never resend request when url changes, which is not what we want
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const loadingData = !data || loading;

  const {
    totalNbTweets = 0,
    totalNbUsernames = 0,
    totalNbAssociatedHashtags = 0,
    nbTweets = 0,
    nbRetweets = 0,
    nbLikes = 0,
    nbQuotes = 0,
    nbReplies = 0,
    volumetry = [],
    nbToLoad,
    nbLoaded,
    search,
  } = data || {};
  const {
    status = '',
    metadata,
    type,
    firstOccurenceDate,
    oldestProcessedDate,
    newestProcessedDate,
  } = search || {};

  const gatheringData = ['PROCESSING', 'PENDING', undefined, ''].includes(status);
  const calculatedRefreshInterval: number = (REFRESH_INTERVALS as any)[status];
  const onLineClick: VolumetryGraphProps['onClick'] = React.useCallback(
    (scale, point) => {
      window.open(
        getTwitterLink(`${searchName}`, {
          date: point.data.x as any,
          asTime: scale === 'hour',
          ...(queryParams.lang ? { lang: queryParams.lang } : {}),
        })
      );
    },
    [searchName, queryParams.lang]
  );

  const onLanguageClick: LanguageTableProps['onLanguageClick'] = React.useCallback(
    (lang: string) => {
      window.open(getTwitterLink(`${searchName}`, { lang }));
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
      router.push(`/searches/${encodeURIComponent(lowerCasedSearchName)}?fromsearch=${searchName}`);
    },
    [searchName]
  );

  const onUsernameSearchClick: UsernameTableProps['onUsernameSearchClick'] = React.useCallback(
    async (usernameWithoutAt: string) => {
      const lowerCasedSearchName = `@${usernameWithoutAt.toLowerCase()}`;
      if (searchName === lowerCasedSearchName) {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
        return;
      }
      await api.post('/api/searches', { name: lowerCasedSearchName });
      router.push(`/searches/${encodeURIComponent(lowerCasedSearchName)}?fromsearch=${searchName}`);
    },
    [searchName]
  );

  const onUsernameViewClick: UsernameTableProps['onUsernameClick'] = React.useCallback(
    (username: string) => {
      router.push(`/user/@${username}?fromsearch=${searchName}`);
    },
    [searchName]
  );

  const onFilterDateChange: any = React.useCallback(
    debounce(async ({ type, dataMin, /*dataMax,*/ min, max }: any) => {
      if (
        type !== 'afterSetExtremes' && // we filter this type of event as it is thrown on load and we only want to refilter when there is a zoom action
        queryParams.min !== `${min}` &&
        queryParams.max !== `${max}`
      ) {
        // We do not need to filter by min and max when we want the whole data to be displayed
        const newMin = dataMin === min ? undefined : `${Math.round(min)}`;
        // For an unknown reason dataMax is always different than max, so dataMin === min is on purpose
        const newMax = dataMin === min ? undefined : `${Math.round(max)}`;
        if (queryParams.min !== newMin || queryParams.max !== newMax) {
          pushQueryParams({ min: newMin, max: newMax }, undefined, {
            scroll: false,
            shallow: true,
          });
        }
      }
    }, 500),
    [queryParams.min, queryParams.max, pushQueryParams]
  );

  const onFilterHashtagChange = React.useCallback(
    (value: string) => {
      pushQueryParams({ hashtag: value }, undefined, {
        scroll: false,
        shallow: true,
      });
    },
    [pushQueryParams]
  );
  const onFilterLangChange = React.useCallback(
    (value: string) => {
      pushQueryParams({ lang: value }, undefined, {
        scroll: false,
        shallow: true,
      });
    },
    [pushQueryParams]
  );
  const onFilterUsernameChange = React.useCallback(
    (value: string) => {
      pushQueryParams({ username: value }, undefined, {
        scroll: false,
        shallow: true,
      });
    },
    [pushQueryParams]
  );

  React.useEffect(() => {
    setRefreshInterval(calculatedRefreshInterval);
  }, [setRefreshInterval, calculatedRefreshInterval]);

  const isUrl = type === 'URL';

  const title = searchName || searchNameFromUrl;
  const hasVolumetry = volumetry.length > 0;

  return (
    <Layout title={`${isUrl ? metadata?.url?.title : title} | Information Manipulation Analyzer`}>
      {title && (
        <Hero>
          {/* Should be a dedicated <Progress /> component */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              transition: '300ms ease',
              width:
                nbLoaded !== nbToLoad
                  ? `${(nbLoaded / nbToLoad) * 100 || 5}%`
                  : nbLoaded > 0
                  ? '100%'
                  : 0,
              height: nbLoaded !== -1 && nbLoaded !== nbToLoad ? '5px' : 0,
              background: 'var(--info)',
            }}
          />
          <div className="fr-container fr-container--fluid fr-py-12w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col fr-p-0">
                <h1 className="text-center ">{title}</h1>

                <>
                  {status === 'PROCESSING_PREVIOUS' && (
                    <Loading size="sm" className="text-center fr-my-2w" />
                  )}

                  <div className="text-center fr-text--xs fr-mb-0 fr-text-color--g500">
                    <em>
                      {status !== 'PENDING' && status !== 'PROCESSING' ? 'Crawled' : ''}
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
              </div>
            </div>
          </div>
        </Hero>
      )}
      {nbToLoad > 3 && nbLoaded !== nbToLoad && (
        <div className="fr-container fr-container-fluid fr-mt-4w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">
              <Alert size="small" type="info" className="fr-mb-2w">
                As there is a large quantity of data, please wait for it to load completely (
                {nbLoaded}/{nbToLoad}).
              </Alert>
            </div>
          </div>
        </div>
      )}

      {(gatheringData || router.isFallback) && <Loading />}

      {status === 'PENDING' && (
        <div className="fr-container fr-container-fluid fr-mt-4w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">
              <Alert size="small" type="info" className="fr-mb-2w">
                Your request is in the queue and will begin shortly.
              </Alert>
            </div>
          </div>
        </div>
      )}

      {status === 'PROCESSING' && (
        <div className="fr-container fr-container-fluid fr-mt-4w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">
              <Alert size="small" type="info" className="fr-mb-2w">
                Data is being extracted from twitter, please be patient.
              </Alert>
            </div>
          </div>
        </div>
      )}

      {status === 'DONE_ERROR' && (
        <div className="fr-container fr-container-fluid fr-mt-4w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">
              <Alert size="small" type="error" className="fr-mb-2w">
                An error occured and processing stopped, please contact the administrator if you
                need more data on this hashtag.
              </Alert>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="fr-container fr-container-fluid fr-mt-4w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">
              <Alert size="small" type="error" className="fr-mb-2w">
                {error}
              </Alert>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="fr-container fr-container-fluid fr-mt-0">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col">
            <Breadcrumb>
              <BreadcrumbItem href="/">All searches</BreadcrumbItem>
              {queryParams.fromsearch && (
                <BreadcrumbItem href={`/searches/${encodeURIComponent(queryParams.fromsearch)}`}>
                  {queryParams.fromsearch}
                </BreadcrumbItem>
              )}
              <BreadcrumbItem isCurrent={true}>{title}</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </div>

      {/* Overview */}
      {totalNbTweets > 0 && (
        <Overview searchName={searchName}>
          <div className="fr-col">
            <Tile
              title={firstOccurenceDate ? dayjs(firstOccurenceDate).format('lll') : 'Searching...'}
              description="Date of first appearance"
              loading={loadingData}
            ></Tile>
          </div>
          <div className="fr-col">
            <Tile
              title={!gatheringData && !loadingData ? totalNbTweets.toLocaleString('en') : '-'}
              description={'Total of Tweets'}
              loading={loadingData}
            ></Tile>
          </div>
          <div className="fr-col">
            <Tile
              title={!gatheringData && !loadingData ? totalNbUsernames.toLocaleString('en') : '-'}
              description={'Total of active users'}
              loading={loadingData}
            ></Tile>
          </div>
          <div className="fr-col">
            <Tile
              title={
                !gatheringData && !loadingData
                  ? totalNbAssociatedHashtags.toLocaleString('en')
                  : '-'
              }
              description={'Total of associated hashtags'}
              loading={loadingData}
            ></Tile>
          </div>
        </Overview>
      )}

      {totalNbTweets === 0 && status === 'DONE' && (
        <h4 className="text-center fr-mb-12w fr-text-color--os500">
          Sorry, we did not found any data for this
        </h4>
      )}

      {/* Volumetry */}
      {hasVolumetry && (
        <>
          <div className="fr-container fr-container-fluid fr-mt-6w fr-mt-md-12w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col">
                <h3>Explore</h3>
              </div>
            </div>
          </div>
          <div className="fr-container fr-container-fluid">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col">
                <h4 className="fr-mb-1v">Volumetry</h4>
                <p className="fr-mb-0">
                  <strong>{nbTweets === undefined ? '-' : nbTweets.toLocaleString('en')}</strong>{' '}
                  tweets, <strong>{nbRetweets.toLocaleString('en')}</strong> retweets,{' '}
                  <strong>{nbLikes.toLocaleString('en')}</strong> likes,{' '}
                  <strong>{nbQuotes.toLocaleString('en')}</strong> quotes,{' '}
                  <strong>{nbReplies.toLocaleString('en')}</strong> replies
                </p>
              </div>
            </div>
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col">
                <VolumetryGraph
                  data={volumetry}
                  min={queryParams.min}
                  max={queryParams.max}
                  onPointClick={onLineClick}
                  onFilterDateChange={onFilterDateChange}
                />
              </div>
            </div>
          </div>

          <UrlFilters />

          {/* Tabs */}
          <Tabs
            forceRenderTabPanel={true}
            selectedTabClassName={classNames(sReactTabs.selectedTab, 'react-tabs__tab--selected"')}
            selectedTabPanelClassName={classNames(
              sReactTabs.selectedTabPanel,
              'react-tabs__tab-panel--selected'
            )}
          >
            <div className="fr-container fr-container-fluid fr-mt-6w">
              <TabList
                className={classNames(
                  'fr-grid-row fr-grid-row--gutters react-tabs__tab-list',
                  sReactTabs.tabList
                )}
              >
                <Tab className={sReactTabs.tab}>Languages</Tab>
                <Tab className={sReactTabs.tab}>Users</Tab>
                <Tab className={sReactTabs.tab}>Associated hashtags</Tab>
                <Tab className={sReactTabs.tab}>Tweets</Tab>
                <Tab className={sReactTabs.tab}>Medias</Tab>
              </TabList>
            </div>
            <div className="fr-container fr-container-fluid">
              <TabPanel>
                <LanguageData
                  search={searchName}
                  refreshInterval={refreshInterval}
                  onLanguageClick={onLanguageClick}
                  onFilter={onFilterLangChange}
                  queryParamsStringified={queryParamsStringified}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__languages`}
                />
              </TabPanel>

              <TabPanel>
                <UsernameData
                  search={searchName}
                  refreshInterval={refreshInterval}
                  onUsernameClick={onUsernameClick}
                  onUsernameViewClick={onUsernameViewClick}
                  onUsernameSearchClick={onUsernameSearchClick}
                  onUsernameFilterClick={onFilterUsernameChange}
                  queryParamsStringified={queryParamsStringified}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__associated-usernames`}
                />
              </TabPanel>

              <TabPanel>
                <HashtagData
                  search={searchName}
                  refreshInterval={refreshInterval}
                  onHashtagClick={onHashtagClick}
                  onHashtagSearchClick={onHashtagSearchClick}
                  onHashtagFilterClick={onFilterHashtagChange}
                  queryParamsStringified={queryParamsStringified}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__associated-hashtags`}
                />
              </TabPanel>

              <TabPanel>
                <TweetsData
                  search={searchName}
                  refreshInterval={refreshInterval}
                  queryParamsStringified={queryParamsStringified}
                />
              </TabPanel>

              <TabPanel>
                <VideosData
                  search={searchName}
                  queryParamsStringified={queryParamsStringified}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__medias-videos`}
                />
                <PhotosData
                  search={searchName}
                  queryParamsStringified={queryParamsStringified}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__medias-photos`}
                />
                <OutlinksData
                  search={searchName}
                  queryParamsStringified={queryParamsStringified}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__medias-outlinks`}
                />
              </TabPanel>
            </div>
          </Tabs>
        </>
      )}
    </Layout>
  );
};

export default SearchPage;
