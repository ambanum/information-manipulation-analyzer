import Link from 'next/link';
import Layout from '../components/Layout';
import styles from './index.module.css';

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1 className={styles.body}>Hello Next.js 👋</h1>
    <div className="rf-table rf-table--no-scroll">
      <table>
        <caption>Résumé du tableau (accessibilité)</caption>
        <thead>
          <tr>
            <th scope="col">Titre</th>
            <th scope="col"> Titre </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Donnée</td>
            <td>Donnée</td>
          </tr>
          <tr>
            <td>Donnée</td>
            <td>Donnée</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
