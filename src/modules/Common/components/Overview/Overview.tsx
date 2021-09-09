import Link from 'next/link';
import React from 'react';
import Tile from '../Tile/Tile';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { getTwitterLink } from 'utils/twitter';
import s from './Overview.module.css';

type OverviewProps = {
  firstOccurenceDate: string | undefined;
  searchName: string;
  gatheringData: any;
  loadingData: any;
  nbUsernames: number;
  totalNbTweets: number;
  nbAssociatedHashtags: number;
} & React.HTMLAttributes<HTMLDivElement>;

const Overview: React.FC<OverviewProps> = ({
  children,
  className,
  firstOccurenceDate,
  searchName,
  gatheringData,
  loadingData,
  nbUsernames,
  totalNbTweets,
  nbAssociatedHashtags,
  ...props
}) => {
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
          <h3>Overview</h3>
        </div>
        <div className={classNames('fr-col-12 fr-col-sm-6', s.overviewHeader_externalLink)}>
          <Link href={getTwitterLink(`${searchName}`, {})}>
            <a title="View `${searchName}` on Twitter" target="_blank" rel="noopener">
              View {searchName} on Twitter
            </a>
          </Link>
        </div>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters fr-mt-1w">
        <div className="fr-col">
          <Tile
            title={firstOccurenceDate ? dayjs(firstOccurenceDate).format('lll') : 'Searching...'}
            description="Date of first appearance"
            loading={loadingData}
          ></Tile>
        </div>
        <div className="fr-col">
          <Tile
            title={!gatheringData && !loadingData ? totalNbTweets.toLocaleString('en') : '-'}
            description={'Total of Tweets'}
            loading={loadingData}
          ></Tile>
        </div>
        <div className="fr-col">
          <Tile
            title={!gatheringData && !loadingData ? nbUsernames.toLocaleString('en') : '-'}
            description={'Total of active users'}
            loading={loadingData}
          ></Tile>
        </div>
        <div className="fr-col">
          <Tile
            title={!gatheringData && !loadingData ? nbAssociatedHashtags.toLocaleString('en') : '-'}
            description={'Total of associated hashtags'}
            loading={loadingData}
          ></Tile>
        </div>
      </div>
    </div>
  );
};

export default Overview;
