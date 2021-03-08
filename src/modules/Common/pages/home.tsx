import Layout from 'modules/Common/components/Layout';
import Link from 'next/link';
import styles from 'modules/DesignSystem/pages/index.module.scss';

const IndexPage = () => (
  <Layout title="Information Manipulation Analyzer">
    <h1 className={styles.title}>Information Manipulation Analyzer</h1>

    <p>
      Here is the homepage
      <Link href="/design-system">
        <a>See design system in action</a>
      </Link>
      <br />
      <Link href="/users">
        <a>Users</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
