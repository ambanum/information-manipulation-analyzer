import React from 'react';
import s from './EdgeDetail.module.css';
import classNames from 'classnames';

type EdgeDetailProps = {
  // TODO
} & React.HTMLAttributes<HTMLDivElement>;

const EdgeDetail: React.FC<EdgeDetailProps> = ({ children, className, ...props }) => {
  return (
    <div className={classNames(s.wrapper, className)} {...props}>
      EdgeDetail
      {children}
    </div>
  );
};

export default EdgeDetail;
