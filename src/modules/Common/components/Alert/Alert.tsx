import React from 'react';
import classNames from 'classnames';
import s from './Alert.module.css';

type AlertProps = {
  title?: string;
  type?: 'info' | 'success' | 'error';
  size?: 'medium' | 'small';
  desc: string;
  close?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Alert: React.FC<AlertProps> = ({
  children,
  className,
  title,
  type = 'info',
  size = 'medium',
  desc,
  close = false,
  ...props
}) => {
  let sizeClass: string = size === 'small' ? 'fr-alert--sm' : '';
  let typeClass: string = 'fr-alert--info';
  if (type === 'success') {
    typeClass = 'fr-alert--success';
  } else if (type === 'error') {
    typeClass = 'fr-alert--error';
  }
  return (
    <div
      role="alert"
      className={classNames('fr-alert ', typeClass, sizeClass, s.alert, className)}
      {...props}
    >
      {title && <p className="fr-alert__title">{title}</p>}
      <p>{desc}</p>
    </div>
  );
};

export default Alert;
