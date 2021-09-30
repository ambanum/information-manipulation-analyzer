import { RiFilterLine as IconFilter } from 'react-icons/ri';
import React from 'react';
import classNames from 'classnames';
import s from './Filters.module.css';

type FiltersProps = {
  // TODO
} & React.HTMLAttributes<HTMLDivElement>;

const Filters: React.FC<FiltersProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(s.filters, 'fr-container fr-container--fluid fr-mt-8w', className)}
      {...props}
    >
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className={classNames(s.filters_content, 'fr-col fr-px-4w fr-pt-4w fr-pb-3w')}>
          <div className={classNames(s.filters_title, 'fr-text--lg fr-mb-0')}>
            <strong>Active filters</strong>
            <IconFilter
              style={{ color: 'var(--bf500)', width: '16px', height: '16px' }}
              className="fr-ml-1v"
            />
          </div>
          <p className="fr-mb-0">The active filters are shown below, click on it to delete.</p>
          <ul className={classNames(s.filters_items, 'fr-mt-2w fr-tags-group')}>{children}</ul>
        </div>
      </div>
    </div>
  );
};

export default Filters;
