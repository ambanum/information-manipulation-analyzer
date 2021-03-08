import Layout from 'modules/Common/components/Layout';

const DesignSystem = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Design system</h1>

      <h2 className="rf-mt-10w">
        Table{' '}
        <a
          className="rf-link"
          href="https://gouvfr.atlassian.net/wiki/spaces/DB/pages/312016971/Tableau+-+Table"
          target="_blank"
        >
          Référence
        </a>
      </h2>
      <div className="rf-table">
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

      <h2 className="rf-mt-10w">
        Accordéon{' '}
        <a
          className="rf-link"
          href="https://gouvfr.atlassian.net/wiki/spaces/DB/pages/312082509/Accord+on+-+Accordion"
          target="_blank"
        >
          Référence
        </a>
      </h2>

      <ul className="rf-accordions-group">
        <li>
          <section className="rf-accordion">
            <h3 className="rf-accordion__title">
              <button
                className="rf-accordion__btn"
                aria-expanded="false"
                aria-controls="rf-accordion-10"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="rf-collapse" id="rf-accordion-10">
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <button className="rf-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="rf-accordion">
            <h3 className="rf-accordion__title">
              <button
                className="rf-accordion__btn"
                aria-expanded="false"
                aria-controls="rf-accordion-11"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="rf-collapse" id="rf-accordion-11">
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
              <button className="rf-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="rf-accordion">
            <h3 className="rf-accordion__title">
              <button
                className="rf-accordion__btn"
                aria-expanded="false"
                aria-controls="rf-accordion-12"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="rf-collapse" id="rf-accordion-12">
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
              <button className="rf-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="rf-accordion">
            <h3 className="rf-accordion__title">
              <button
                className="rf-accordion__btn"
                aria-expanded="false"
                aria-controls="rf-accordion-13"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="rf-collapse" id="rf-accordion-13">
              <p>
                Qui elit in aliqua exercitation. Sint exercitation incididunt duis eu mollit sunt id
                dolor ullamco excepteur adipisicing deserunt. Dolore mollit ullamco laboris nulla
                qui ad officia. Ad deserunt ex magna esse culpa ea occaecat sit tempor.
              </p>
              <button className="rf-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="rf-accordion">
            <h3 className="rf-accordion__title">
              <button
                className="rf-accordion__btn"
                aria-expanded="false"
                aria-controls="rf-accordion-14"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="rf-collapse" id="rf-accordion-14">
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
              <button className="rf-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
        <li>
          <section className="rf-accordion">
            <h3 className="rf-accordion__title">
              <button
                className="rf-accordion__btn"
                aria-expanded="false"
                aria-controls="rf-accordion-15"
              >
                Intitulé accordéon
              </button>
            </h3>
            <div className="rf-collapse" id="rf-accordion-15">
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
              <button className="rf-btn" title="Label bouton MD">
                Label bouton MD
              </button>
            </div>
          </section>
        </li>
      </ul>
      <h2 className="rf-mt-10w">
        Search bar{' '}
        <a
          className="rf-link"
          href="https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217186376/Barre+de+recherche+-+Search+bar"
          target="_blank"
        >
          Référence
        </a>
      </h2>
      <div className="rf-search-bar" id="search-input">
        <label className="rf-label" for="search-input-input">
          Label de la barre de recherche
        </label>
        <input
          className="rf-input"
          placeholder="Rechercher"
          type="search"
          id="search-input-input"
          name="search-input-input"
        />
        <button className="rf-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
      <h2 className="rf-mt-10w">
        Button{' '}
        <a
          className="rf-link"
          href="https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217284660/Boutons+-+Buttons"
          target="_blank"
        >
          Référence
        </a>
      </h2>
      <ul className="rf-btns-group rf-btns-group--inline">
        <li>
          <button className="rf-btn">Label bouton</button>
        </li>
        <li>
          <button className="rf-btn rf-btn--secondary">Label bouton</button>
        </li>
      </ul>

      <br />
      <br />
      <br />
    </Layout>
  );
};

export default DesignSystem;
