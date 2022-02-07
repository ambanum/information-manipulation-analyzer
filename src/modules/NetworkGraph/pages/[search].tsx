import { Breadcrumb, BreadcrumbItem } from '@dataesr/react-dsfr';
import { Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';

import Alert from 'modules/Common/components/Alert/Alert';
import { GetServerSideProps } from 'next';
import GraphDetail from 'modules/NetworkGraph/components/GraphDetail';
import Layout from 'modules/Embassy/components/Layout';
import React from 'react';
import { Select } from '@dataesr/react-dsfr';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import shuffle from 'lodash/fp/shuffle';
import useUrl from 'hooks/useUrl';
import Graph from '../data-components/Graph';

const NetworkGraphDebugPage = ({ search, files, selected: selectedInUrl }: any) => {
  return (
    <Layout title="Twitter network of interaction graph">
      <Graph search={search} />
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      search: query.search,
    },
  };
};
export default NetworkGraphDebugPage;
