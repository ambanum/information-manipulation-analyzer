import * as RemixIcons from 'react-icons/ri';

import Link from 'next/link';
import React from 'react';

export interface CardProps {
  image?: string;
  imageAlt?: string;
  title?: React.ReactNode | number;
  detail?: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  horizontal?: boolean;
  noArrow?: boolean;
  enlargeLink?: boolean;
  direction?: 'left' | 'right';
  loading?: boolean;
  iconName?: keyof typeof RemixIcons;
  iconColor?: string;
}

const Card: React.FunctionComponent<CardProps & React.HTMLAttributes<HTMLDivElement>> = ({
  loading,
  image,
  imageAlt,
  detail,
  title,
  href,
  description,
  className,
  horizontal,
  enlargeLink,
  noArrow,
  iconName,
  iconColor = '#0496FF',
  style,
  direction = 'left',
  ...props
}) => {
  const imageTag = (
    <div className="fr-card__img">
      <img className="fr-responsive-img" src={image} alt={imageAlt} />
    </div>
  );
  return (
    <div
      className={`fr-card ${className || ''} ${horizontal ? 'fr-card--horizontal' : ''} ${
        enlargeLink ? 'fr-enlarge-link' : ''
      } ${noArrow ? 'fr-card--no-arrow' : ''}`}
      style={{ ...style, opacity: loading ? 0.3 : 1 }}
      {...props}
    >
      {image && direction === 'left' && imageTag}
      <div className="fr-card__body">
        {(detail || iconName) && (
          <p className="fr-card__detail">
            {iconName &&
              React.createElement((RemixIcons as any)[iconName], {
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
      {image && direction === 'right' && imageTag}
    </div>
  );
};

export default Card;
