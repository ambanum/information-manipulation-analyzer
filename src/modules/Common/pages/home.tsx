import Search, { SearchProps } from 'components/Search';

import LastHashtags from '../data-components/LastHashtags';
import Layout from 'modules/Embassy/components/Layout';
import axios from 'axios';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  const onSubmit: SearchProps['onSearchSubmit'] = async (hashtag) => {
    try {
      await axios.post('/api/hashtags', { name: hashtag });
      router.push(`/hashtags/${hashtag}`);
    } catch (e) {
      console.log(''); // eslint-disable-line
      console.log('╔════START══e══════════════════════════════════════════════════'); // eslint-disable-line
      console.log(e); // eslint-disable-line
      console.log('╚════END════e══════════════════════════════════════════════════'); // eslint-disable-line
    }
  };

  return (
    <Layout title="Information Manipulation Analyzer">
      <div className="rf-container rf-mb-12w">
        <div className="rf-grid-row">
          <div className="rf-col">
            <h1 className="text-center rf-mb-1w">Information Manipulation Analyzer</h1>
            <p
              className="rf-text--lg text-center rf-mb-7w"
              style={{ maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}
            >
              Volumetry. Artificial boost probability. Most active users. Related hashtags.
            </p>
            <Search
              className="rf-mx-md-12w"
              label="Recherche"
              buttonLabel="Rechercher"
              placeholder="Enter a hashtag"
              onSearchSubmit={onSubmit}
            />
            <p className="rf-text--sm text-center rf-mb-7w">
              <em>Finally get a real idea on wheter a #hashtag is worth the hype</em>
            </p>

            <h2 className="rf-mt-12w rf-mb-2w rf-ml-1v">Check previous hashtags</h2>
            <LastHashtags />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
