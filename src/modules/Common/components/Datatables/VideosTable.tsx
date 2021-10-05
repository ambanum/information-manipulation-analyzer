import { Video, VideosTableProps } from './VideosTable.d';

import React from 'react';
import Table from 'components/Table';

const VideosTable = ({ exportName, data, nbData }: VideosTableProps) => {
  const columns = [
    {
      Header: 'Video',
      disableSortBy: true,
      accessor: 'fullUrl',
      size: 3,
      Cell: ({ value, raw }: any) => (
        <div className="videoContainer">
          <video height="184" controls poster={raw?.original?.thumbnailUrl}>
            <source src={value} type={raw?.original?.contentType}></source>
          </video>
        </div>
      ),
    },
    {
      Header: 'Number of appearances',
      accessor: 'count',
      align: 'right',
      size: 1,
    },
    {
      Header: 'Actions',
      align: 'right',
      Cell: ({ ...rest }: any) => {
        return (
          <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--right fr-btns-group--inline">
            <li>
              <button
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-fi-external-link-line fr-btn--icon-left"
                title={`Go to ${rest.row?.original?.fullUrl}`}
                onClick={() => {
                  window.open(rest.row?.original.fullUrl, '_blank');
                }}
              ></button>
            </li>
          </ul>
        );
      },
      size: 1,
    },
  ];

  return (
    <Table<Video>
      title="Associated videos"
      subtitle={`${(nbData || data.length).toLocaleString('en')} videos by number of appearances`}
      columns={columns}
      data={data}
      sortBy={[
        {
          id: 'count',
          desc: true,
        },
      ]}
      layoutFixed
      noScroll
      virtualize={{ height: 500, itemSize: 214 }}
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(VideosTable);
