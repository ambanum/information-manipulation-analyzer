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
}: WithClassname<CardProps>) => {
  return (
    <div
      className={`rf-card ${className || ''} ${horizontal ? 'rf-card--horizontal' : ''} ${
        noArrow ? 'rf-card--no-arrow' : ''
      }`}
      style={{ opacity: loading ? 0.3 : 1 }}
    >
      {image && (
        <div className="rf-card__img">
          <img src={image} alt={imageAlt} />
        </div>
      )}
      <div className="rf-card__body">
        {detail && <p className="rf-card__detail">{detail}</p>}

        <h4 className="rf-card__title">
          {href && !href.startsWith('http') && (
            <Link href={href}>
              <a className="rf-card__link">{title}</a>
            </Link>
          )}
          {href && href.startsWith('http') && (
            <a href={href} target="_blank" rel="noreferrer noopener" className="rf-card__link">
              {title}
            </a>
          )}
          {!href && title}
        </h4>
        {description && <p className="rf-card__desc">{description}</p>}
      </div>
    </div>
  );
};

export default Card;
