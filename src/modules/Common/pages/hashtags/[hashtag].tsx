import { GetHashtagResponse, Hashtag } from '../../interfaces';
import HashtagTable, { HashtagTableProps } from '../../components/Datatables/HashtagTable';
import LanguageGraph, {
  LanguageGraphOptions,
  LanguageGraphProps,
} from '../../components/Charts/LanguageGraph';
import UsernameTable, { UsernameTableProps } from '../../components/Datatables/UsernameTable';
import VolumetryGraph, {
  VolumetryGraphOptions,
  VolumetryGraphProps,
} from '../../components/Charts/VolumetryGraph';

import Card from 'components/Card';
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
const shouldPoll = (status: string) => ['DONE', 'DONE_ERROR', 'DONE_FIRST_FETCH'].includes(status);

dayjs.extend(localizedFormat);

export default function HashtagPage({
  hashtag,
  volumetry,
  languages,
  usernames,
  associatedHashtags,
}: {
  hashtag: Hashtag;
  volumetry: VolumetryGraphProps['data'];
  languages: LanguageGraphProps['data'];
  usernames: UsernameTableProps['data'];
  associatedHashtags: HashtagTableProps['data'];
}) {
  const [skip, setSkip] = React.useState(shouldPoll(hashtag?.status));
  const { data } = useSWR<GetHashtagResponse>(`/api/hashtags/${hashtag.name}`, {
    initialData: { status: 'ok', message: '', hashtag },
    refreshInterval: 3000,
    isPaused: () => skip,
  });

  const { status = '' } = data?.hashtag || {};

  const onLineClick: VolumetryGraphOptions['onClick'] = (point) => {
    window.open(getTwitterLink(hashtag.name, { date: point.data.x as any }));
  };

  const onPieClick: LanguageGraphOptions['onClick'] = ({ id: lang }) => {
    window.open(getTwitterLink(hashtag.name, { lang: lang as string }));
  };

  const onUsernameClick: UsernameTableProps['options']['onUsernameClick'] = (username: string) => {
    window.open(getTwitterLink(hashtag.name, { username }));
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
            {['PROCESSING', 'PENDING'].includes(status) && <Loading />}
          </div>
        </div>
      </div>
      <div className="rf-container rf-container-fluid">
        <div className="rf-grid-row rf-grid-row--gutters">
          <div className="rf-col-3">
            <Card
              horizontal
              title={
                hashtag.firstOccurenceDate
                  ? dayjs(hashtag.firstOccurenceDate).format('lll')
                  : 'Searching...'
              }
              href={getTwitterLink(hashtag.name, { endDate: hashtag.firstOccurenceDate })}
              description={'Date of first appearance'}
            />
          </div>
          <div className="rf-col-3">
            <Card
              horizontal
              title={usernames.length.toLocaleString('en')}
              description={'Nb Active users de'}
              noArrow
            />
          </div>
          <div className="rf-col-3">
            <Card
              horizontal
              title={associatedHashtags.length.toLocaleString('en')}
              description={'Nb Associated hashtags'}
              noArrow
            />
          </div>
          <div className="rf-col-3">
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
        <div className="rf-container rf-container-fluid">
          <div className="rf-grid-row rf-grid-row--gutters">
            <div className="rf-col-6">
              <UsernameTable data={usernames} options={{ onUsernameClick }} />
            </div>
            <div className="rf-col-6">
              <HashtagTable data={associatedHashtags} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
