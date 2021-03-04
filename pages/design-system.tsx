import Layout from '../components/Layout';
import Link from 'next/link';

const DesignSystem = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Design system</h1>
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
};

export default DesignSystem;
