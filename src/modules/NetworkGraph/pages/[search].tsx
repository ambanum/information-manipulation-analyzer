import { GetServerSideProps } from 'next';
import Layout from 'modules/Embassy/components/Layout';
import React from 'react';
import Graph from '../data-components/Graph';

const NetworkGraphDebugPage = ({ search }: any) => {
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
