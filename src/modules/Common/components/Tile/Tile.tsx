import Link from 'next/link';
import React from 'react';
import classNames from 'classnames';
import s from './Tile.module.css';

type TileProps = {
  title?: React.ReactNode;
  imageSrc?: string;
  description?: string;
  direction?: 'vertical' | 'horizontal';
  href?: string;
  loading?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>;

const Tile: React.FC<TileProps> = ({
  children,
  className,
  title,
  imageSrc,
  description,
  direction = 'vertical',
  href,
  loading,
  ...props
}) => {
  return (
    <div
      className={classNames(
        'fr-tile',
        href != null ? 'fr-enlarge-link' : null,
        direction === 'horizontal' ? 'fr-tile--horizontal' : null,
        s.tile,
        className
      )}
      style={{ opacity: loading ? 0.3 : 1 }}
      {...props}
    >
      <div className="fr-tile__body">
        {href && (
          <h4 className="fr-tile__title">
            <Link href={href}>
              <a className="fr-tile__link">{title}</a>
            </Link>
          </h4>
        )}
        {!href && <h4 className="fr-tile__title">{title}</h4>}
        {description && <p className="fr-tile__desc">{description}</p>}
      </div>
      {imageSrc && (
        <div className="fr-tile__img">
          <img src={imageSrc} className="fr-responsive-img" alt="" />
        </div>
      )}
    </div>
  );
};

export default Tile;
