import React from 'react';
import classNames from 'classnames';
import s from './Header.module.css';

type HeaderProps = {
  // TODO
} & React.HTMLAttributes<HTMLDivElement>;

const Header: React.FC<HeaderProps> = ({ children, className, ...props }) => {
  return (
    <div className={classNames(s.header, className)} {...props}>
      {children}
    </div>
  );
};

export default Header;
