import React from 'react';
import s from './NodeDetail.module.css';
import classNames from 'classnames';

type NodeDetailProps = {
  // TODO
} & React.HTMLAttributes<HTMLDivElement>;

const NodeDetail: React.FC<NodeDetailProps> = ({ children, className, ...props }) => {
  return (
    <div className={classNames(s.wrapper, className)} {...props}>
      NodeDetail
      {children}
    </div>
  );
};

export default NodeDetail;
