import Link from 'next/link';
import React from 'react';
import classNames from 'classnames';
import s from './BreadcrumbItem.module.css';

type BreadcrumbItemProps = {
  href: string;
} & React.LiHTMLAttributes<HTMLLIElement>;

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ children, className, href, ...props }) => {
  return (
    <li className={classNames(s.breadcrumbItem, className)} {...props}>
      <Link href={href}>
        <a className="fr-breadcrumb__link">{children}</a>
      </Link>
    </li>
  );
};

export default BreadcrumbItem;
