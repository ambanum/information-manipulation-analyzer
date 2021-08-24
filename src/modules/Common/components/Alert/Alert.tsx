import React from 'react';
import classNames from 'classnames';
import s from './Alert.module.css';
import { useEffect } from 'react';
import { useToggle } from 'react-use';

type AlertProps = {
  title?: string;
  type?: 'info' | 'success' | 'error';
  size?: 'medium' | 'small';
  close?: boolean;
  autoCloseDelay?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const Alert: React.FC<AlertProps> = ({
  children,
  className,
  title,
  type = 'info',
  size = 'medium',
  close = false,
  autoCloseDelay,
  ...props
}) => {
  let sizeClass: string = size === 'small' ? 'fr-alert--sm' : '';
  const [on, toggle] = useToggle(true);

  if (autoCloseDelay != 0) {
    useEffect(() => {
      setTimeout(() => {
        toggle(false);
      }, autoCloseDelay);
    });
  }

  if (on) {
    return (
      <div
        role="alert"
        className={classNames('fr-alert ', `fr-alert--${type}`, sizeClass, s.alert, className)}
        {...props}
      >
        {title && <p className="fr-alert__title">{title}</p>}
        <p>{children}</p>
        {close && (
          <button className="fr-link--close fr-link" onClick={() => toggle(false)}>
            Masquer le message
          </button>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

export default Alert;
