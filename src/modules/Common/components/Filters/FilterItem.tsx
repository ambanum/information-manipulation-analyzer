import React from 'react';
import classNames from 'classnames';
import s from './FilterItem.module.css';

type FilterItemProps = {
  // TODO
} & React.LiHTMLAttributes<HTMLLIElement>;

const FilterItem: React.FC<FilterItemProps> = ({ children, className, ...props }) => {
  return (
    <li className={classNames(s.filterItem, className)} {...props}>
      <a href="#" className="fr-tag fr-fi-close-line fr-tag--icon-left">
        {children}
      </a>
    </li>
  );
};

export default FilterItem;
