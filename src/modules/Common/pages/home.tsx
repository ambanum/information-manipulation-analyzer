import Search, { SearchProps } from 'components/Search';

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
      <div className="fr-container fr-mb-12w">
        <div className="fr-grid-row">
          <div className="fr-col">
            <h1 className="text-center fr-mb-1w">
              Information Manipulation Analyzer
              <sup>
                <span
                  style={{
                    background: 'var(--rm500)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  className="fr-tag fr-tag--sm fr-ml-1w"
                >
                  BETA
                </span>
              </sup>
            </h1>
            <p
              className="fr-text--lg text-center fr-mb-7w"
              style={{ maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}
            >
              Volumetry. Artificial boost probability. Most active users. Related hashtags.
            </p>
            <Search
              className="fr-mx-md-12w"
              label="Search"
              buttonLabel="Search"
              placeholder="Enter a #hashtag, a keyword, a @mention, a $cashtag or a https://url"
              onSearchSubmit={onSubmit}
              onSearchChange={onSearchChange}
            />
            <p className="fr-text--sm text-center fr-mb-10w">
              <em>Finally get a real idea on whether a trend is worth the hype</em>
            </p>
            <Alert
              size="small"
              title="Start exploring IMA by searching your own data."
              close={true}
            >
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
