import React, { ReactNode } from 'react';

import Head from 'next/head';
import Link from 'next/link';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="rf-header" role="banner">
      {/* https://gouvfr.atlassian.net/wiki/spaces/DB/pages/222789846/En-t+te+-+Header */}
      <div className="rf-container">
        <div className="rf-header__body">
          <div className="rf-header__brand">
            <Link href="/">
              <a className="rf-logo" title="République française">
                <span className="rf-logo__title">
                  République
                  <br />
                  française
                </span>
              </a>
            </Link>
          </div>
          <div className="rf-header__navbar">
            <div className="rf-service">
              <Link href="/">
                <a className="rf-service__title" title="Nom du service">
                  Nom du service
                </a>
              </Link>
              <p className="rf-service__tagline">baseline - précisions sur l‘organisation</p>
            </div>
          </div>
          <div className="rf-header__tools">
            <div className="rf-shortcuts">
              <ul className="rf-shortcuts__list">
                <li className="rf-shortcuts__item">
                  <a href="https://disinfo.quaidorsay.fr/" className="rf-link" target="_self">
                    Accueil
                  </a>
                </li>
                <li className="rf-shortcuts__item">
                  <a
                    href="https://disinfo.quaidorsay.fr/fr#nos-actions"
                    className="rf-link"
                    target="_self"
                  >
                    Nos actions
                  </a>
                </li>
                <li className="rf-shortcuts__item">
                  <a
                    href="https://disinfo.quaidorsay.fr/fr/nos-outils"
                    className="rf-link"
                    target="_self"
                  >
                    Nos outils
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div className="rf-container rf-my-2w">
      <div className="rf-grid-row">
        <div className="rf-col">{children}</div>
      </div>
    </div>

    <footer className="rf-footer" role="contentinfo" id="footer">
      {/*https://gouvfr.atlassian.net/wiki/spaces/DB/pages/222331413/Pied+de+page+-+Footer*/}
      <div className="rf-container">
        <div className="rf-footer__body">
          <div className="rf-footer__brand">
            <a className="rf-logo" href="#" title="république française">
              <span className="rf-logo__title">
                république
                <br />
                française
              </span>
            </a>
          </div>
          <div className="rf-footer__content">
            <p className="rf-footer__content-desc">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <ul className="rf-footer__content-list">
              <li>
                <a className="rf-footer__content-link" href="https://legifrance.gouv.fr">
                  legifrance.gouv.fr
                </a>
              </li>
              <li>
                <a className="rf-footer__content-link" href="https://gouvernement.fr">
                  gouvernement.fr
                </a>
              </li>
              <li>
                <a className="rf-footer__content-link" href="https://service-public.fr">
                  service-public.fr
                </a>
              </li>
              <li>
                <a className="rf-footer__content-link" href="https://data.gouv.fr">
                  data.gouv.fr
                </a>
              </li>
              <li>
                <Link href="/design-system">
                  <a className="rf-footer__content-link">See design system in action</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="rf-footer__bottom">
          <ul className="rf-footer__bottom-list">
            <li className="rf-footer__bottom-item">
              <a className="rf-footer__bottom-link" href="#">
                Plan du site
              </a>
            </li>
            <li className="rf-footer__bottom-item">
              <a className="rf-footer__bottom-link" href="#">
                Accessibilité: non/partiellement/totalement conforme
              </a>
            </li>
            <li className="rf-footer__bottom-item">
              <a className="rf-footer__bottom-link" href="#">
                Mentions légales
              </a>
            </li>
            <li className="rf-footer__bottom-item">
              <a className="rf-footer__bottom-link" href="#">
                Données personnelles
              </a>
            </li>
            <li className="rf-footer__bottom-item">
              <a className="rf-footer__bottom-link" href="#">
                Gestion des cookies
              </a>
            </li>
          </ul>
          <div className="rf-footer__bottom-copy">© République Française 2020</div>
        </div>
      </div>
    </footer>
  </div>
);

export default Layout;
