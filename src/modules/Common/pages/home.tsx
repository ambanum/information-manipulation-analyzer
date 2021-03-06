import Search, { SearchProps } from 'components/Search';

import Alert from '../components/Alert/Alert';
import { CreateHashtagResponse } from 'modules/Common/interfaces';
import LastHashtags from '../data-components/LastHashtags';
import Layout from 'modules/Embassy/components/Layout';
import React from 'react';
import api from 'utils/api';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  const [filter, setFilter] = React.useState('');
  const onSubmit: SearchProps['onSearchSubmit'] = async (hashtag) => {
    try {
      const { data } = await api.post<CreateHashtagResponse>('/api/hashtags', { name: hashtag });
      router.push(`/hashtags/${data?.hashtag?.name}`);
    } catch (e) {
      console.log(''); // eslint-disable-line
      console.log('╔════START══e══════════════════════════════════════════════════'); // eslint-disable-line
      console.log(e); // eslint-disable-line
      console.log('╚════END════e══════════════════════════════════════════════════'); // eslint-disable-line
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
                  className="fr-tag fr-tag--sm"
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
              placeholder="Enter a hashtag"
              onSearchSubmit={onSubmit}
              onSearchChange={onSearchChange}
            />
            <p className="fr-text--sm text-center fr-mb-10w">
              <em>Finally get a real idea on whether a #hashtag is worth the hype</em>
            </p>
            <Alert size="small" title="Start exploring IMA by searching your own hashtag.">
              For transparency purposes, the search history is displayed below.
            </Alert>

            <h2 className="fr-mt-6w fr-mb-2w fr-ml-1v">Check previous hashtags</h2>
            <LastHashtags filter={filter} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
