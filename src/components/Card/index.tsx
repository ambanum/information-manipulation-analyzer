import * as RemixIcons from 'react-icons/ri';

import Link from 'next/link';
import React from 'react';

interface CardProps {
  image?: string;
  imageAlt?: string;
  title: React.ReactNode;
  detail?: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  horizontal?: boolean;
  noArrow?: boolean;
  loading?: boolean;
  iconName?: keyof typeof RemixIcons;
  iconColor?: string;
}

const Card = ({
  loading,
  image,
  imageAlt,
  detail,
  title,
  href,
  description,
  className,
  horizontal,
  noArrow,
  iconName,
  iconColor = '#0496FF',
}: WithClassname<CardProps>) => {
  return (
    <div
      className={`fr-card ${className || ''} ${horizontal ? 'fr-card--horizontal' : ''} ${
        noArrow ? 'fr-card--no-arrow' : ''
      }`}
      style={{ opacity: loading ? 0.3 : 1 }}
    >
      {image && (
        <div className="fr-card__img">
          <img src={image} alt={imageAlt} />
        </div>
      )}
      <div className="fr-card__body">
        {(detail || iconName) && (
          <p className="fr-card__detail">
            {iconName &&
              React.createElement(RemixIcons[iconName], {
                color: iconColor,
                style: { marginRight: '4px' },
              })}
            {detail && detail}
          </p>
        )}
        <h4 className="fr-card__title">
          {href && !href.startsWith('http') && (
            <Link href={href}>
              <a className="fr-card__link">{title}</a>
            </Link>
          )}
          {href && href.startsWith('http') && (
            <a href={href} target="_blank" rel="noreferrer noopener" className="fr-card__link">
              {title}
            </a>
          )}
          {!href && title}
        </h4>

        {description && <p className="fr-card__desc">{description}</p>}
      </div>
    </div>
  );
};

export default Card;
