import Link from 'next/link';
import React from 'react';
import classNames from 'classnames';
import s from './BreadcrumbItem.module.css';

type BreadcrumbItemProps = {
  href?: string;
  isCurrent?: boolean;
} & React.LiHTMLAttributes<HTMLLIElement>;

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  children,
  className,
  href,
  isCurrent,
  ...props
}) => {
  return (
    <li className={classNames(s.breadcrumbItem, className)} {...props}>
      {href && (
        <Link href={href}>
          <a className="fr-breadcrumb__link" aria-current={isCurrent && 'page'}>
            {children}
          </a>
        </Link>
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
