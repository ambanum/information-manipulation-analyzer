import React from 'react';
import classNames from 'classnames';
import s from './Alert.module.css';

type AlertProps = {
  title?: string;
  type?: 'info' | 'success' | 'error';
  size?: 'medium' | 'small';
  close?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Alert: React.FC<AlertProps> = ({
  children,
  className,
  title,
  type = 'info',
  size = 'medium',
  close = false,
  ...props
}) => {
  let sizeClass: string = size === 'small' ? 'fr-alert--sm' : '';

  return (
    <div
      role="alert"
      className={classNames('fr-alert ', `fr-alert--${type}`, sizeClass, s.alert, className)}
      {...props}
    >
      {title && <p className="fr-alert__title">{title}</p>}
      <p>{children}</p>
    </div>
  );
};

export default Alert;
