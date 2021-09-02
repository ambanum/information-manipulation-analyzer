import React from 'react';
import classNames from 'classnames';
import s from './Breadcrumb.module.css';

type BreadcrumbProps = {
  // TODO
} & React.HTMLAttributes<HTMLDivElement>;

const Breadcrumb: React.FC<BreadcrumbProps> = ({ children, className, ...props }) => {
  return (
    <nav
      role="navigation"
      aria-label="You are here:"
      className={classNames('fr-breadcrumb', s.breadcrumb, className)}
      {...props}
    >
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">
        See the breadcrumb
      </button>
      <div className="fr-collapse" id="breadcrumb-1">
        <ol className="fr-breadcrumb__list">{children}</ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
