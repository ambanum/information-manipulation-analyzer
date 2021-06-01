import Layout from 'modules/Embassy/components/Layout';

const DesignSystem = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Design system</h1>

      <h2 className="fr-mt-10w">
        Table{' '}
        <a
          className="fr-link"
          href="https://gouvfr.atlassian.net/wiki/spaces/DB/pages/312016971/Tableau+-+Table"
          target="_blank"
        >
          Référence
        </a>
      </h2>
      <div className="fr-table">
        <table>
          <caption>Résumé du tableau (accessibilité)</caption>
          <thead>
            <tr>
              <th scope="col">Titre</th>
              <th scope="col"> Titre </th>
              <th scope="col"> Titre </th>
              <th scope="col"> Titre </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Donnée</td>
              <td>Donnée</td>
              <td>Donnée</td>
              <td>Donnée</td>
            </tr>
            <tr>
              <td>Donnée</td>
              <td>Donnée</td>
              <td>Donnée</td>
              <td>Donnée</td>
            </tr>
            <tr>
              <td>Donnée</td>
              <td>Donnée</td>
              <td>Donnée</td>
              <td>Donnée</td>
            </tr>
            <tr>
              <td>Donnée</td>
              <td>Donnée</td>
              <td>Donnée</td>
              <td>Donnée</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="fr-mt-10w">
        Accordéon{' '}
        <a
          className="fr-link"
          href="https://gouvfr.atlassian.net/wiki/spaces/DB/pages/312082509/Accord+on+-+Accordion"
          target="_blank"
        >
          Référence
        </a>
      </h2>

      <ul className="fr-accordions-group">
        <li>
          <section className="fr-accordion">
            <h3 className="fr-accordion__title">
              <button
                className="fr-accordion__btn"
                aria-expanded="false"
                aria-controls="fr-accordion-10"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="fr-collapse" id="fr-accordion-10">
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <button className="fr-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="fr-accordion">
            <h3 className="fr-accordion__title">
              <button
                className="fr-accordion__btn"
                aria-expanded="false"
                aria-controls="fr-accordion-11"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="fr-collapse" id="fr-accordion-11">
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <button className="fr-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="fr-accordion">
            <h3 className="fr-accordion__title">
              <button
                className="fr-accordion__btn"
                aria-expanded="false"
                aria-controls="fr-accordion-12"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="fr-collapse" id="fr-accordion-12">
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <button className="fr-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="fr-accordion">
            <h3 className="fr-accordion__title">
              <button
                className="fr-accordion__btn"
                aria-expanded="false"
                aria-controls="fr-accordion-13"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="fr-collapse" id="fr-accordion-13">
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <button className="fr-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="fr-accordion">
            <h3 className="fr-accordion__title">
              <button
                className="fr-accordion__btn"
                aria-expanded="false"
                aria-controls="fr-accordion-14"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="fr-collapse" id="fr-accordion-14">
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <button className="fr-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="fr-accordion">
            <h3 className="fr-accordion__title">
              <button
                className="fr-accordion__btn"
                aria-expanded="false"
                aria-controls="fr-accordion-15"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="fr-collapse" id="fr-accordion-15">
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <button className="fr-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
      </ul>
      <h2 className="fr-mt-10w">
        Search bar{' '}
        <a
          className="fr-link"
          href="https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217186376/Barre+de+recherche+-+Search+bar"
          target="_blank"
        >
          Référence
        </a>
      </h2>
      <div className="fr-search-bar" id="search-input">
        <label className="fr-label" htmlFor="search-input">
          Label de la barre de recherche
        </label>
        <input
          className="fr-input"
          placeholder="Rechercher"
          type="search"
          id="search-input-input"
          name="search-input-input"
        />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
      <h2 className="fr-mt-10w">
        Button{' '}
        <a
          className="fr-link"
          href="https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217284660/Boutons+-+Buttons"
          target="_blank"
        >
          Référence
        </a>
      </h2>
      <ul className="fr-btns-group fr-btns-group--inline">
        <li>
          <button className="fr-btn">Label bouton</button>
        </li>
        <li>
          <button className="fr-btn fr-btn--secondary">Label bouton</button>
        </li>
      </ul>

      <br />
      <br />
      <br />
    </Layout>
  );
};

export default DesignSystem;
