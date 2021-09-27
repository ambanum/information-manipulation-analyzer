import { Photo, PhotosTableProps } from './PhotosTable.d';

import React from 'react';
import Table from 'components/Table';

const PhotosTable = ({ exportName, data, nbData }: PhotosTableProps) => {
  const columns = [
    {
      Header: 'Photo',
      accessor: 'fullUrl',
      size: 3,
      Cell: ({ value }: any) => (
        <img src={value} style={{ maxWidth: '256px', maxHeight: '144px' }} />
      ),
    },
    {
      Header: 'Count',
      accessor: 'count',
      align: 'right',
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
      virtualize={{ height: 500, itemSize: 164 }}
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(PhotosTable);
