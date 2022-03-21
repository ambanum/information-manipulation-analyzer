import 'react-tabs/style/react-tabs.css';

import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import Alert from 'modules/Common/components/Alert/Alert';
import Breadcrumb from 'modules/Common/components/Breadcrumb';
import { GetSearchResponse } from '../../interfaces';
import GraphCreator from 'modules/NetworkGraph/data-components/GraphCreator';
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
import omit from 'lodash/fp/omit';
import sReactTabs from 'modules/Embassy/styles/react-tabs.module.css';
import { useRouter } from 'next/router';
import useSplitSWR from 'hooks/useSplitSWR';
import useUrl from 'hooks/useUrl';

const ssrConfig = {
  loading: () => <Loading message="Loading..." />,
  ssr: false,
};

const LanguageData = dynamic(() => import('../../data-components/Language'), ssrConfig);
const HashtagData = dynamic(() => import('../../data-components/Hashtag'), ssrConfig);
const UsernameData = dynamic(() => import('../../data-components/Username'), ssrConfig);
const NbTweetsRepartition = dynamic(
  () => import('../../data-components/NbTweetsRepartition'),
  ssrConfig
);
const BotRepartition = dynamic(() => import('../../data-components/BotRepartition'), ssrConfig);
const VolumetryGraph = dynamic(() => import('../../components/Charts/VolumetryGraph'), ssrConfig);
const TweetsData = dynamic(() => import('../../data-components/Tweets'), ssrConfig);
const VideosData = dynamic(() => import('../../data-components/Videos'), ssrConfig);
const PhotosData = dynamic(() => import('../../data-components/Photos'), ssrConfig);
const OutlinksData = dynamic(() => import('../../data-components/Outlinks'), ssrConfig);
const CoordinatedInauthenticBehaviorData = dynamic(
  () => import('../../data-components/CoordinatedInauthenticBehavior'),
  ssrConfig
);

const humanize = Intl.NumberFormat('en', { notation: 'compact' }).format;

export { default as getStaticPaths } from './[search].staticPaths';
export { default as getStaticProps } from './[search].staticProps';

const REFRESH_INTERVALS = {
  PROCESSING_PREVIOUS: 60 * 1000,
  DONE: 60 * 60 * 1000,
  DONE_ERROR: 0,
  DONE_FIRST_FETCH: 0,
  PENDING: 3 * 1000,
  PROCESSING: 60 * 1000,
  '': 5 * 1000,
};

dayjs.extend(localizedFormat);

const recalculateTotals = (volumetry: any[], { min, max }: any) => {
  let nbTweets = 0;
  let nbLikes = 0;
  let nbRetweets = 0;
  let nbReplies = 0;
  let nbQuotes = 0;
  let nbUsernames = 0;
  let nbAssociatedHashtags = 0;
  volumetry.forEach((vol: any) => {
    const volumetryDayJs = dayjs(vol.hour);

    if (
      (!min && !max) ||
      (min && max && volumetryDayJs.isAfter(dayjs(+min)) && volumetryDayJs.isBefore(dayjs(+max)))
    ) {
      // Calculate number of tweets
      nbTweets += vol.nbTweets;
      nbLikes += vol.nbLikes;
      nbRetweets += vol.nbRetweets;
      nbReplies += vol.nbReplies;
      nbQuotes += vol.nbQuotes;
      nbUsernames += vol.nbUsernames;
      nbAssociatedHashtags += vol.nbAssociatedHashtags;
    }
  });

  return {
    nbTweets,
    nbLikes,
    nbRetweets,
    nbReplies,
    nbQuotes,
    nbUsernames,
    nbAssociatedHashtags,
  };
};

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

  const {
    queryParams,
    pushQueryParams,
    queryParamsStringified,
    stringifyParams,
    pushQueryParam,
    removeQueryParam,
  } = useUrl();

  const [refreshInterval, setRefreshInterval] = React.useState(
    REFRESH_INTERVALS[defaultSearch?.status || '']
  );

  const queryParamsThatCauseRefresh = omit(['min', 'max', 'tabIndex'], queryParams);
  const queryParamsThatCauseRefreshStringified = stringifyParams(queryParamsThatCauseRefresh);

  const { data, loading, error } = useSplitSWR(
    searchName
      ? `/api/searches/${encodeURIComponent(
          searchName as string
        )}/split${queryParamsThatCauseRefreshStringified}`
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
        volumetry: defaultVolumetry,
      },
      refreshInterval,
      dedupingInterval: refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const loadingData = !data || loading;

  const {
    totalNbTweets = 0,
    totalNbUsernames = 0,
    totalNbAssociatedHashtags = 0,
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

  const { nbTweets, nbRetweets, nbLikes, nbQuotes, nbReplies } = recalculateTotals(volumetry, {
    min: queryParams.min,
    max: queryParams.max,
  });

  const gatheringData = ['PROCESSING', 'PENDING', undefined, ''].includes(status);

  const additionalRefreshTime =
    nbTweets && nbTweets > 500000 && status.includes('PROCESSING')
      ? (nbTweets * 5 * 60 * 1000) / 1000000 // additional 5 minute per 1,000,000 tweets
      : 0;

  const calculatedRefreshInterval: number =
    ((REFRESH_INTERVALS as any)[status] || 0) + additionalRefreshTime;

  const onLineClick: VolumetryGraphProps['onClick'] = React.useCallback(
    (scale, point) => {
      window.open(
        getTwitterLink(`${searchName}`, {
          date: point.x,
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
          // FIXME we recalculate here from the existing url as using queryParams.tabIndex
          // does not work as expected
          // even when passing it through the useCallback dependencies
          const existingTabIndex =
            new URLSearchParams(window.location.search).get('tabIndex') || '0';

          pushQueryParams(
            {
              tabIndex: existingTabIndex,
              min: newMin,
              max: newMax,
            },
            undefined,
            {
              scroll: false,
              shallow: true,
            }
          );
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
  const onFilterTweetContentChange = React.useCallback(
    (value: string) => {
      pushQueryParams({ content: value }, undefined, {
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
          <div className="fr-container fr-container--fluid fr-pt-12w fr-pb-4w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col fr-p-0 text-center">
                <h1 className="fr-mb-0 ">{title}</h1>
                <>
                  {status === 'PROCESSING_PREVIOUS' && <Loading size="sm" className=" fr-my-2w" />}
                </>
                <div className="fr-text--xs fr-text-color--g500 fr-mb-4w">
                  <em>
                    {status !== 'PENDING' && !status.includes('PROCESSING') ? 'Crawled' : ''}
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

      {/* Breadcrumb */}
      <Container className="fr-mt-0">
        <Row>
          <Col>
            <Breadcrumb
              items={[
                {
                  name: 'Twitter',
                  url: `/`,
                },
                {
                  name: 'Explore narrative',
                  url: `/`,
                },
                ...(queryParams?.fromsearch
                  ? [
                      {
                        name: queryParams.fromsearch,
                        url: `/searches/${encodeURIComponent(queryParams.fromsearch)}`,
                      },
                    ]
                  : []),
                { name: title },
              ]}
            />
          </Col>
        </Row>
      </Container>

      {/* Overview */}
      {totalNbTweets > 0 && (
        <Overview searchName={searchName} className="fr-pb-4w">
          <div className="fr-col">
            <Tile
              title={firstOccurenceDate ? dayjs(firstOccurenceDate).format('lll') : 'Searching...'}
              description="Date of first appearance"
              loading={loadingData}
            ></Tile>
          </div>
          <div className="fr-col">
            <Tile
              title={totalNbTweets?.toLocaleString('en') || ''}
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

      {hasVolumetry && <GraphCreator search={searchName} />}

      <Container>
        {hasVolumetry && (
          <>
            <Row gutters className="">
              <Col>
                <Title as="h4" look="h4" className="fr-mb-1w">
                  Volumetry
                </Title>
                <p className="fr-mb-0">
                  <strong>{nbTweets === undefined ? '-' : humanize(nbTweets)}</strong> tweets,{' '}
                  <strong>{humanize(nbRetweets)}</strong> retweets,{' '}
                  <strong>{humanize(nbLikes)}</strong> likes, <strong>{humanize(nbQuotes)}</strong>{' '}
                  quotes, <strong>{humanize(nbReplies)}</strong> replies
                </p>
              </Col>
            </Row>
          </>
        )}
        {(gatheringData || router.isFallback) && (
          <Row className="fr-my-4w">
            <Col>
              <Loading message="Loading..." />
            </Col>
          </Row>
        )}
        {status === 'PENDING' && (
          <Row className="fr-mt-2w fr-mb-8w" justifyContent="center" gutters>
            <Col n="6">
              <Alert size="small" type="info" className="fr-mb-2w">
                Your request is in the queue and will begin shortly.
              </Alert>
            </Col>
          </Row>
        )}
        {status === 'PROCESSING' && (
          <Row className="fr-mt-2w fr-mb-8w" justifyContent="center" gutters>
            <Col n="6">
              <Alert size="small" type="info" className="fr-mb-2w">
                Data is being extracted from Twitter, please be patient.
              </Alert>
            </Col>
          </Row>
        )}
        {status === 'DONE_ERROR' && (
          <Row className="fr-mt-2w fr-mb-8w" justifyContent="center" gutters>
            <Col n="6">
              <Alert size="small" type="error" className="fr-mb-2w">
                An error occured and processing stopped, please contact the administrator if you
                need more data on this hashtag.
              </Alert>
            </Col>
          </Row>
        )}
        {error && (
          <Row className="fr-mt-2w fr-mb-8w" justifyContent="center" gutters>
            <Col n="6">
              <Alert size="small" type="error" className="fr-mb-2w">
                {error}
              </Alert>
            </Col>
          </Row>
        )}
        {totalNbTweets === 0 && status === 'DONE' && (
          <Row className="fr-mt-2w fr-mb-8w" justifyContent="center" gutters>
            <Col n="6">
              <Alert size="small" type="error" className="fr-mb-2w">
                Sorry, we did not found any data for <strong>{searchName}</strong>
              </Alert>
            </Col>
          </Row>
        )}
      </Container>

      {/* Volumetry */}
      {hasVolumetry && (
        <>
          <Container>
            <Row gutters>
              <Col>
                <VolumetryGraph
                  data={volumetry}
                  min={queryParams.min}
                  max={queryParams.max}
                  onPointClick={onLineClick}
                  onFilterDateChange={onFilterDateChange}
                />
              </Col>
            </Row>
          </Container>
          <UrlFilters />
          {/* Tabs */}
          <Tabs
            forceRenderTabPanel={false}
            selectedTabClassName={classNames(sReactTabs.selectedTab, 'react-tabs__tab--selected"')}
            selectedTabPanelClassName={classNames(
              sReactTabs.selectedTabPanel,
              'react-tabs__tab-panel--selected'
            )}
            selectedIndex={+queryParams.tabIndex || 0}
            onSelect={
              ((tabIndex: number) => {
                const options = {
                  scroll: false,
                  shallow: true,
                };
                if (tabIndex === 0) {
                  return removeQueryParam('tabIndex', undefined, options);
                }
                return pushQueryParam('tabIndex', undefined, options)(tabIndex);
              }) as any
            }
            className="fr-mb-8w"
          >
            <div className="fr-container fr-container-fluid fr-mt-6w">
              <TabList className={classNames('react-tabs__tab-list', sReactTabs.tabList)}>
                <Tab className={sReactTabs.tab}>Languages</Tab>
                <Tab className={sReactTabs.tab}>Users</Tab>
                <Tab className={sReactTabs.tab}>Associated hashtags</Tab>
                <Tab className={sReactTabs.tab}>Tweets</Tab>
                <Tab className={sReactTabs.tab}>Medias</Tab>
                <Tab className={sReactTabs.tab}>C.I.B</Tab>
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
                <div className="fr-mt-8w">
                  <NbTweetsRepartition
                    search={searchName}
                    refreshInterval={refreshInterval}
                    queryParamsStringified={queryParamsStringified}
                  />
                </div>
                <div className="fr-mt-8w">
                  <BotRepartition
                    search={searchName}
                    refreshInterval={refreshInterval}
                    queryParamsStringified={queryParamsStringified}
                  />
                </div>
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
              <TabPanel>
                <CoordinatedInauthenticBehaviorData
                  search={searchName}
                  queryParamsStringified={queryParamsStringified}
                  onTweetContentFilterClick={onFilterTweetContentChange}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__medias-videos`}
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
