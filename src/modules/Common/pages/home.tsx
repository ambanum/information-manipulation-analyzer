import Search, { SearchProps } from 'components/Search';

import Alert from '../components/Alert/Alert';
import { CreateSearchResponse } from 'modules/Common/interfaces';
import Header from 'modules/Common/components/Header/Header';
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
  const onSubmit: SearchProps['onSearchSubmit'] = async (search) => {
    try {
      const { data } = await api.post<CreateSearchResponse>('/api/searches', { name: search });
      if (data.status === 'ok') {
        router.push(`/searches/${encodeURIComponent(data?.search?.name as string)}`);
      } else {
        notify('warning', data.message || '');
      }
    } catch (e) {
      notify('error', e.toString());
    }
  };

  const onSearchChange = (searchValue: string) => {
    setFilter(searchValue);
  };

  return (
    <Layout title="Information Manipulation Analyzer">
      <Header>
        <div className="fr-container fr-py-4w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">
              <h1 className="text-center">
                Information Manipulation Analyzer
                <sup>
                  <span
                    style={{
                      background: '#0762C8',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                    className="fr-tag fr-tag--sm fr-ml-1w"
                  >
                    BETA
                  </span>
                </sup>
              </h1>
              <h6 className="text-center">
                Volumetry. Artificial boost probability. <br />
                Most active users. Related hashtags.
              </h6>
            </div>
          </div>
        </div>
      </Header>

      <div className="fr-container fr-mt-8w">
        <div className="fr-grid-row">
          <div className="fr-col">
            <Search
              className="fr-mx-md-12w"
              label="Search"
              buttonLabel="Search"
              placeholder="Enter a #hashtag, a keyword, a @mention, a $cashtag or a https://url"
              onSearchSubmit={onSubmit}
              onSearchChange={onSearchChange}
            />
            <p className="fr-text--sm text-center fr-mt-1w">
              <em>Finally get a real idea on whether a trend is worth the hype</em>
            </p>
          </div>
        </div>
      </div>

      <div className="fr-container fr-mt-2w">
        <div className="fr-grid-row">
          <div className="fr-col">
            <Alert size="small" close={true}>
              For transparency purposes, the search history is displayed below.
            </Alert>
            <LastSearches filter={filter} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
