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
        <video controls width="256" height="144" poster={raw?.original?.thumbnailUrl}>
          <source src={value} type={raw?.original?.contentType}></source>
        </video>
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
    <Table<Video>
      title={`${(nbData || data.length).toLocaleString('en')} videos`}
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

export default React.memo(VideosTable);
