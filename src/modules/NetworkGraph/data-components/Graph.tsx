import { Col, Container, Row, Title } from '@dataesr/react-dsfr';

import Breadcrumb from 'modules/Common/components/Breadcrumb';
import Alert from 'modules/Common/components/Alert/Alert';
import Loading from 'components/Loading';
import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import s from './Graph.module.css';
import shuffle from 'lodash/fp/shuffle';
import useSWR from 'swr';
import { Button } from '@dataesr/react-dsfr';
import api from 'utils/api';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const GraphDetail = dynamic(() => import('modules/NetworkGraph/components/GraphDetail'), {
  ssr: false,
});

const dsfrColors = shuffle([
  '#91ae4f',
  '#107449',
  '#169b62',
  '#344f4b',
  '#008169',
  '#00ac8c',
  '#80d5c6',
  '#41548e',
  '#5770be',
  '#abb8df',
  '#d5dbef',
  '#ededf2',
  '#363a5b',
  '#484d7a',
  '#a3a6bc',
  '#d1d2de',
  '#bf6a5e',
  '#ff8d7e',
  '#ffc6be',
  '#9c6759',
  '#c0806f',
  '#ffc29e',
  '#bfae00',
  '#ead737',
  '#ffe800',
  '#fff480',
  '#fff9bf',
  '#be9b31',
  '#fdcf41',
  '#bf7330',
  '#ff9940',
  '#d0805b',
  '#bf5339',
  '#cb634b',
  '#ff6f4c',
  '#ffb7a5',
  '#5e3a44',
  '#7d4e5b',
  '#bea7ad',
  '#794e43',
  '#956052',
  '#a26859',
]);

const REFRESH_INTERVALS = {
  DONE: 60 * 60 * 1000,
  DONE_ERROR: 0,
  PENDING: 5 * 1000,
  PROCESSING: 60 * 1000,
  '': 5 * 1000,
};

export type GraphProps = {
  search: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Graph: React.FC<GraphProps> = ({ className, search, ...props }) => {
  const [refreshInterval, setRefreshInterval] = React.useState(REFRESH_INTERVALS['']);

  const { data, isValidating, error, mutate } = useSWR(`/api/graph/${encodeURIComponent(search)}`, {
    refreshInterval,
  });
  const loading = !data && isValidating;
  const json = data?.searchGraph?.result;
  const status = data?.searchGraph?.status;
  const calculatedRefreshInterval: number = (REFRESH_INTERVALS as any)[status];
  const collectionDate = json?.metadata?.data_collection_date;
  const oldestProcessedDate = json?.metadata?.last_collected_date;

  const onReprocessClick = async () => {
    await api.put(`/api/graph/${encodeURIComponent(search)}`);
    mutate();
  };

  React.useEffect(() => {
    setRefreshInterval(calculatedRefreshInterval);
  }, [setRefreshInterval, calculatedRefreshInterval]);

  return (
    <div className={classNames(s.wrapper, className)} {...props}>
      <div style={{ backgroundColor: 'var(--grey-975)' }}>
        <Container className="fr-py-12w">
          <Row gutters={true}>
            <Col>
              <div className="text-center">
                <Title as="h1" look="h1">
                  {search}
                </Title>
                <div className="fr-text--xs fr-text-color--g500 fr-mb-4w">
                  <em>
                    {status !== 'PENDING' ? 'Crawled' : ''}
                    {status === 'PROCESSING' && (
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
                    {collectionDate && (
                      <>
                        {' '}
                        until{' '}
                        <strong>
                          {collectionDate ? dayjs(collectionDate).format('llll') : 'Searching...'}
                        </strong>
                      </>
                    )}
                  </em>
                </div>
              </div>
              {status === 'PROCESSING' && (
                <div className="text-center">
                  <Loading size="sm" message="Data is being gathered" />
                </div>
              )}
              {status === 'PENDING' && (
                <div className="text-center">
                  <Loading
                    size="sm"
                    message="Your request is in the queue and will begin shortly."
                  />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
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
                {
                  name: search,
                  url: `/searches/${encodeURIComponent(search)}`,
                },
                { name: 'Network of interaction graph' },
              ]}
            />
          </Col>
        </Row>
        {collectionDate && dayjs().diff(collectionDate, 'minute') >= 1 && (
          <Row className="fr-text--sm fr-mb-4w text-right">
            <Col>
              Graph has been processed <strong>{dayjs(collectionDate).fromNow()}</strong>. You can
              now safely{' '}
              <Button size="sm" onClick={onReprocessClick} secondary>
                reprocess it
              </Button>
            </Col>
          </Row>
        )}
      </Container>
      {!loading && error ? (
        <div className={classNames(s.noData, className)} {...props}>
          <Alert type="error">{error.toString()}</Alert>
        </div>
      ) : loading ? (
        <>
          <Container className="fr-mb-6w">
            <Row>
              <Col>
                <Loading message="Loading..." />
              </Col>
            </Row>
            <Row>
              <Col>
                <Alert size="small">
                  Due to the amount of data processed, the graph generation{' '}
                  <strong>can take several minutes</strong> (be patient) and this requires a{' '}
                  <strong>recent machine to be used properly</strong> (on mobile it is not
                  feasible).
                </Alert>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <>
          {[undefined, 'PENDING'].includes(status) && <Loading message="Loading..." />}
          {status === 'DONE_ERROR' && <Alert type="error">{data?.searchGraph.error}</Alert>}
          {['DONE', 'PROCESSING'].includes(status) && (
            <GraphDetail colors={dsfrColors} name={search} json={json} />
          )}
        </>
      )}
      {loading && <Loading message="Loading..." />}
    </div>
  );
};

export default Graph;
