import Search, { SearchProps } from 'components/Search';
import { useRouter } from 'next/router';

import { GetHashtagsResponse } from '../interfaces';
import LastHashtags from '../data-components/LastHashtags';
import Layout from 'modules/Common/components/Layout';
import axios from 'axios';
import { mutate } from 'swr';
import styles from 'modules/DesignSystem/pages/index.module.scss';

const HomePage = () => {
  const router = useRouter();
  const onSubmit: SearchProps['onSubmit'] = async (hashtag) => {
    mutate(
      '/api/hashtags',
      (data: GetHashtagsResponse) => ({
        ...data,
        hashtags: [...data.hashtags, { name: hashtag }],
      }),
      false
    );
    try {
      await axios.post('/api/hashtags', { name: hashtag });
      router.push(`/hashtags/${hashtag}`);
      mutate('/api/hashtags');
    } catch (e) {
      console.log(''); // eslint-disable-line
      console.log('╔════START══e══════════════════════════════════════════════════'); // eslint-disable-line
      console.log(e); // eslint-disable-line
      console.log('╚════END════e══════════════════════════════════════════════════'); // eslint-disable-line
    }
  };

  return (
    <Layout title="Information Manipulation Analyzer">
      <h1 className={styles['text-center']}>Information Manipulation Analyzer</h1>
      <Search
        label="Recherche"
        buttonLabel="Rechercher"
        placeholder="Entrez un hashtag"
        onSubmit={onSubmit}
      />
      <h2>Check previous hashtags</h2>
      <LastHashtags />
    </Layout>
  );
};

export default HomePage;
