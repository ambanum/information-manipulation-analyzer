import Link from 'next/link';
import React from 'react';
import classNames from 'classnames';

export interface IBreadcrumb {
  name: string;
  url?: string;
}

interface IProps {
  items: IBreadcrumb[];
}

const Breadcrumb: React.FC<IProps & React.HTMLAttributes<HTMLDivElement>> = ({
  items,
  className,
}) => (
  <nav className={`fr-breadcrumb ${className}`} role="navigation">
    <ul className="fr-breadcrumb__list">
      {items.map(({ name, url }, i: number) => (
        <React.Fragment key={name ? `${name}-${i}` : i}>
          <li
            className={classNames('fr-breadcrumb__item', {
              ['fr-breadcrumb__item--current']: !url,
            })}
            key={name}
          >
            {url && (
              <Link href={url} passHref={!url.startsWith('/')}>
                <a className="fr-breadcrumb__link">{name}</a>
              </Link>
            )}
            {!url && (
              <a aria-current target="_self" className="fr-breadcrumb__link">
                {name}
              </a>
            )}
          </li>
        </React.Fragment>
      ))}
    </ul>
  </nav>
);

export default Breadcrumb;
