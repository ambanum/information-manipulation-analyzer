import Search, { SearchProps } from 'components/Search';

import Layout from 'modules/Common/components/Layout';
import styles from 'modules/DesignSystem/pages/index.module.scss';

const HomePage = () => {
  const onSubmit: SearchProps['onSubmit'] = (hashtag) => {
    alert(`You've entered ${hashtag}`);
  };

  return (
    <Layout title="Information Manipulation Analyzer">
      <h1 className={styles.title}>Information Manipulation Analyzer</h1>
      <Search
        label="Recherche"
        buttonLabel="Rechercher"
        placeholder="Entrez un hashtag"
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default HomePage;
