import { Photo, PhotosTableProps } from './PhotosTable.d';

import React from 'react';
import Table from 'components/Table';

const PhotosTable = ({ exportName, data, nbData }: PhotosTableProps) => {
  const columns = [
    {
      Header: 'Photo',
      disableSortBy: true,
      accessor: 'fullUrl',
      size: 3,
      Cell: ({ value }: any) => (
        <img src={value} style={{ maxWidth: '344px', maxHeight: '184px' }} />
      ),
    },
    {
      Header: 'Count',
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
    <Table<Photo>
      title={`${(nbData || data.length).toLocaleString('en')} photos`}
      subtitle="Lorem ipsum"
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

export default React.memo(PhotosTable);
