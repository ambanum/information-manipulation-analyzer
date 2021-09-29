import React from 'react';
import classNames from 'classnames';
import s from './FilterItem.module.css';

type FilterItemProps = {
  onRemove: () => void;
} & React.LiHTMLAttributes<HTMLLIElement>;

const FilterItem: React.FC<FilterItemProps> = ({ children, className, onRemove, ...props }) => {
  return (
    <li className={classNames(s.filterItem, className)} {...props}>
      <button onClick={onRemove} className="fr-tag fr-fi-close-line fr-tag--icon-left">
        {children}
      </button>
    </li>
  );
};

export default FilterItem;
