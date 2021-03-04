import Layout from '../components/Layout';
import Link from 'next/link';
import styles from './index.module.css';

const IndexPage = () => (
  <Layout title="Information Manipulation Analyzer">
    <h1 className={styles.title}>Information Manipulation Analyzer</h1>

    <p>
      <Link href="/design-system">
        <a>See design system in action</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
