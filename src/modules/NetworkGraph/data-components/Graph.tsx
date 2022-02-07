import React from 'react';
import { NetworkGraphProps } from 'modules/NetworkGraph/components/NetworkGraph.d';
import classNames from 'classnames';
// import dynamic from 'next/dynamic';
import s from './Graph.module.css';
import useSWR from 'swr';
// const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
//   ssr: false,
// });
import { Breadcrumb, BreadcrumbItem } from '@dataesr/react-dsfr';
import { Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';

import Alert from 'modules/Common/components/Alert/Alert';
import { GetServerSideProps } from 'next';
import GraphDetail from 'modules/NetworkGraph/components/GraphDetail';
import Layout from 'modules/Embassy/components/Layout';
import { Select } from '@dataesr/react-dsfr';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import shuffle from 'lodash/fp/shuffle';
import useUrl from 'hooks/useUrl';
// import Graph from '../data-components/Graph';
import Loading from 'components/Loading';

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
  PROCESSING: 15 * 1000,
  '': 5 * 1000,
};

export type GraphProps = {
  search: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Graph: React.FC<GraphProps> = ({ className, search, ...props }) => {
  const [refreshInterval, setRefreshInterval] = React.useState(REFRESH_INTERVALS['']);

  const { data, isValidating, error } = useSWR(`/api/graph/${encodeURIComponent(search)}`, {
    refreshInterval,
  });
  const loading = !data && isValidating;
  const json = data?.searchGraph?.result;
  const metadata = json?.metadata || {};
  const status = data?.searchGraph?.status;
  const calculatedRefreshInterval: number = (REFRESH_INTERVALS as any)[status];

  React.useEffect(() => {
    setRefreshInterval(calculatedRefreshInterval);
  }, [setRefreshInterval, calculatedRefreshInterval]);

  if (!loading && error) {
    return (
      <div className={classNames(s.noData, className)} {...props}>
        <Alert type="error">{error.toString()}</Alert>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={classNames(s.wrapper, className)} {...props}>
      <div style={{ backgroundColor: 'var(--grey-975)' }}>
        <Container className="fr-py-12w">
          <Row gutters={true}>
            <Col>
              <div className="text-center">
                <Title>{search}</Title>
              </div>
              <div className="text-center" style={{ color: 'var(--grey-425)' }}>
                <Text size="sm">
                  <em>{status === 'PROCESSING' && <p>Data is being gathered</p>}</em>
                  {/* <em>{status === 'PENDING' && <Loading size="sm" />}</em> */}
                </Text>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="fr-mt-0">
          <Row>
            <Col>
              <Breadcrumb>
                <BreadcrumbItem href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`}>
                  Twitter
                </BreadcrumbItem>
                <BreadcrumbItem href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`}>
                  Explore narratives
                </BreadcrumbItem>
                <BreadcrumbItem
                  href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/search/${encodeURIComponent(
                    search
                  )}`}
                >
                  {search}
                </BreadcrumbItem>
                <BreadcrumbItem>Network of interaction graph</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
        <Container className="fr-mb-6w">
          <Row>
            <Col>
              <Alert size="small" className="">
                Due to the amount of data processed, the graph generation{' '}
                <strong>can take several minutes</strong> (be patient) and this requires a{' '}
                <strong>recent machine to be used properly</strong> (on mobile it is not feasible).
              </Alert>
            </Col>
          </Row>
        </Container>
        {['PENDING', 'PROCESSING'].includes(status)}
        {status === 'DONE_ERROR' && <Alert type="error">{data?.searchGraph.error}</Alert>}
        {status === 'DONE' && <GraphDetail colors={dsfrColors} name={search} json={json} />}
      </div>
    </div>
  );
};

export default Graph;