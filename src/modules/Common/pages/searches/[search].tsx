import 'react-tabs/style/react-tabs.css';

import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import Alert from 'modules/Common/components/Alert/Alert';
import Breadcrumb from 'modules/Common/components/Breadcrumb/Breadcrumb';
import BreadcrumbItem from 'modules/Common/components/Breadcrumb/BreadcrumbItem';
import Card from 'components/Card';
import { GetSearchResponse } from '../../interfaces';
import { HashtagTableProps } from '../../components/Datatables/HashtagTable.d';
import Hero from 'modules/Common/components/Hero/Hero';
import Layout from 'modules/Embassy/components/Layout';
import Loading from 'components/Loading';
import Overview from 'modules/Common/components/Overview/Overview';
import { PieChartProps } from '../../components/Charts/PieChart.d';
import React from 'react';
import Tile from 'modules/Common/components/Tile/Tile';
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
import useSWR from 'swr';
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
  nbUsernames: defaultNbUsernames,
  nbTweets: defaultNbTweets,
  nbAssociatedHashtags: defaultNbAssociatedHashtags,
}: {
  search: GetSearchResponse['search'];
  nbTweets: GetSearchResponse['nbTweets'];
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

  const { data, isValidating } = useSWR<GetSearchResponse>(
    searchName
      ? `/api/searches/${encodeURIComponent(searchName as string)}${queryParamsStringified}`
      : null,
    {
      initialData: {
        status: 'ok',
        message: '',
        search: defaultSearch,
        nbTweets: defaultNbTweets,
        volumetry: defaultVolumetry,
        nbUsernames: defaultNbUsernames,
        nbAssociatedHashtags: defaultNbAssociatedHashtags,
      },
      refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  const loadingData = !data || isValidating;

  const { nbTweets = 0, volumetry = [], nbUsernames = 0, nbAssociatedHashtags = 0 } = data || {};
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

  const onPieClick: PieChartProps['onSliceClick'] = React.useCallback(
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
          });
        }
      }
    }, 500),
    [queryParams.min, queryParams.max, searchName, router]
  );

  React.useEffect(() => {
    setRefreshInterval(REFRESH_INTERVALS[status]);
  }, [status]);

  const isUrl = type === 'URL';

  const title = searchName || searchNameFromUrl;
  const hasVolumetry = volumetry[0]?.data?.length > 0;

  return (
    <Layout title={`${isUrl ? metadata?.url?.title : title} | Information Manipulation Analyzer`}>
      {title && (
        <Hero>
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

      {type === 'URL' && (
        <div className="fr-container fr-container-fluid fr-mb-2w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">
              <Card
                horizontal
                enlargeLink
                direction="right"
                href={(searchName as string) || ''}
                title={metadata?.url?.title}
                detail={metadata?.url?.site}
                description={metadata?.url?.description}
                image={metadata?.url?.image?.url}
                imageAlt={metadata?.url?.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overview */}
      {nbTweets > 0 && (
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
              title={!gatheringData && !loadingData ? nbTweets.toLocaleString('en') : '-'}
              description={'Total of Tweets'}
              loading={loadingData}
            ></Tile>
          </div>
          <div className="fr-col">
            <Tile
              title={!gatheringData && !loadingData ? nbUsernames.toLocaleString('en') : '-'}
              description={'Total of active users'}
              loading={loadingData}
            ></Tile>
          </div>
          <div className="fr-col">
            <Tile
              title={
                !gatheringData && !loadingData ? nbAssociatedHashtags.toLocaleString('en') : '-'
              }
              description={'Total of associated hashtags'}
              loading={loadingData}
            ></Tile>
          </div>
        </Overview>
      )}

      {nbTweets === 0 && status === 'DONE' && (
        <h4 className="text-center fr-mb-12w fr-text-color--os500">
          Sorry, we did not found any data for this
        </h4>
      )}

      {/* Volumetry */}
      {hasVolumetry && (
        <>
          <div className="fr-container fr-container-fluid fr-mt-12w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col">
                <h3>Explore</h3>
              </div>
            </div>
          </div>
          <div className="fr-container fr-container-fluid">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col">
                <h4 className="fr-mb-1v">{nbTweets.toLocaleString('en')} tweets</h4>
                <p className="fr-mb-0">Some words about volumetry.</p>
              </div>
            </div>
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col">
                <VolumetryGraph
                  data={volumetry}
                  defaultValues={queryParams}
                  onPointClick={onLineClick}
                  onFilterDateChange={onFilterDateChange}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            forceRenderTabPanel={true}
            selectedTabClassName={classNames(sReactTabs.selectedTab, 'react-tabs__tab--selected"')}
            selectedTabPanelClassName={classNames(
              sReactTabs.selectedTabPanel,
              'react-tabs__tab-panel--selected'
            )}
          >
            <div className="fr-container fr-container-fluid fr-mt-12w">
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
              </TabList>
            </div>
            <div className="fr-container fr-container-fluid">
              <TabPanel>
                <LanguageData
                  search={searchName}
                  refreshInterval={refreshInterval}
                  onSliceClick={onPieClick}
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
                  onUsernameSearchClick={onUsernameSearchClick}
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
                  queryParamsStringified={queryParamsStringified}
                  exportName={`${dayjs(newestProcessedDate).format(
                    'YYYYMMDDHH'
                  )}__${searchName}__associated-hashtags`}
                />
              </TabPanel>

              <TabPanel>
                <TweetsData />
              </TabPanel>
            </div>
          </Tabs>
        </>
      )}
    </Layout>
  );
};

export default SearchPage;
