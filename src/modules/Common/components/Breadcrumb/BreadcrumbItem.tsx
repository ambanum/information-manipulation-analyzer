import Link, { LinkProps } from 'next/link';

import React from 'react';
import classNames from 'classnames';
import s from './BreadcrumbItem.module.scss';

type BreadcrumbItemProps = {
  href?: LinkProps['href'];
  onClick?: React.AnchorHTMLAttributes<HTMLAnchorElement>['onClick'];
  isCurrent?: boolean;
} & Omit<React.LiHTMLAttributes<HTMLLIElement>, 'onClick'>;

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  children,
  className,
  href,
  onClick,
  isCurrent,
  ...props
}) => {
  return (
    <li className={classNames(s.breadcrumbItem, className)} {...props}>
      {href && (
        <Link href={href} passHref prefetch>
          <a className="fr-breadcrumb__link" aria-current={isCurrent && 'page'}>
            {children}
          </a>
        </Link>
      )}
      {!href && onClick && (
        <a className="fr-breadcrumb__link" aria-current={isCurrent && 'page'} onClick={onClick}>
          {children}
        </a>
      )}
      {isCurrent && (
        <a className="fr-breadcrumb__link" aria-current="page">
          {children}
        </a>
      )}
    </li>
  );
};

export default BreadcrumbItem;
