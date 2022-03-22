import Link from 'next/link';
import React from 'react';
import classNames from 'classnames';
import { getTwitterLink } from 'utils/twitter';
import s from './Overview.module.css';

type OverviewProps = {
  searchName: string;
  title?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Overview: React.FC<OverviewProps> = ({
  children,
  className,
  searchName,
  title = 'Narrative overview',
  ...props
}) => {
  searchName = searchName.length > 30 ? `${searchName.substring(0, 30)}...` : searchName;
  return (
    <div
      className={classNames('fr-container fr-container-fluid', s.overview, className)}
      {...props}
    >
      <div
        className={classNames(
          'fr-grid-row fr-grid-row--gutters fr-grid-row--middle',
          s.overviewHeader
        )}
      >
        <div className="fr-col-12 fr-col-sm-6">
          <h3>{title}</h3>
        </div>
        <div className={classNames('fr-col-12 fr-col-sm-6', s.overviewHeader_externalLink)}>
          <Link href={getTwitterLink(`${searchName}`, {})}>
            <a title={`View ${searchName} on Twitter`} target="_blank" rel="noopener">
              View {searchName} on Twitter
            </a>
          </Link>
        </div>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters fr-mt-1w">{children}</div>
    </div>
  );
};

export default Overview;
