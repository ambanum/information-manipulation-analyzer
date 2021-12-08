import { TweetContent, TweetContentTableProps } from './TweetContentTable.d';

import React from 'react';
import Table from 'components/Table';

const TweetContentsTable = ({ exportName, data, nbData, onFilter }: TweetContentTableProps) => {
  const columns = [
    {
      Header: 'Content',
      accessor: 'content',
      size: 3,
    },
    {
      Header: 'Number of appearances',
      accessor: 'count',
      align: 'right',
      sortType: 'number',
      Cell: ({ value }: any) => value.toLocaleString('en'),
      size: 1,
    },
  ];

  return (
    <Table<TweetContent>
      title="Similar Tweets"
      subtitle={`${(nbData || data.length).toLocaleString('en')} same tweets have been found`}
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
      virtualize={{ height: 500, itemSize: 56 }}
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(TweetContentsTable);
