import { Col, Container, Row } from '@dataesr/react-dsfr';
import Search, { SearchProps } from 'components/Search/Search';

import Alert from '../components/Alert/Alert';
import { CreateSearchResponse } from 'modules/Common/interfaces';
import LastSearches from '../data-components/LastSearches';
import Layout from 'modules/Embassy/components/Layout';
import React from 'react';
import api from 'utils/api';
import useNotifier from 'hooks/useNotifier';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  const { notify } = useNotifier();
  const [filter, setFilter] = React.useState('');
  const onSubmit: SearchProps['onSearchSubmit'] = async (search: string) => {
    try {
      const { data } = await api.post<CreateSearchResponse>('/api/searches', { name: search });
      if (data.status === 'ok') {
        router.push(`/searches/${encodeURIComponent(data?.search?.name as string)}`);
      } else {
        notify('warning', data.message || '');
      }
    } catch (e: any) {
      notify('error', e.toString());
    }
  };

  const onSearchChange = (searchValue: string) => {
    setFilter(searchValue);
  };

  return (
    <Layout title="Information Manipulation Analyzer">
      <Search
        title="What do you want to explore?"
        baseline="Finally get a real idea on whether a narrative is worth the hype."
        label="Explore"
        buttonLabel="Explore"
        placeholder="Enter a #hashtag, a keyword, a @mention, a $cashtag or a https://url"
        onSearchSubmit={onSubmit}
        onSearchChange={onSearchChange}
      />

      <Container>
        <Row>
          <Col>
            <LastSearches filter={filter} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default HomePage;
