import Search, { SearchProps } from 'components/Search';
import { useRouter } from 'next/router';

import LastHashtags from '../data-components/LastHashtags';
import Layout from 'modules/Embassy/components/Layout';
import axios from 'axios';

const HomePage = () => {
  const router = useRouter();
  const onSubmit: SearchProps['onSubmit'] = async (hashtag) => {
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
            <h1 className="text-center rf-mb-5w">Information Manipulation Analyzer</h1>
            <Search
              className="rf-mx-md-12w"
              label="Recherche"
              buttonLabel="Rechercher"
              placeholder="Entrez un hashtag"
              onSubmit={onSubmit}
            />
            <h2 className="rf-my-5w">Check previous hashtags</h2>
            <LastHashtags />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
