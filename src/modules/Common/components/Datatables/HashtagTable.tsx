import { Hashtag, HashtagTableProps } from './HashtagTable.d';

import React from 'react';
import Table from 'components/Table';

const HashtagTable = ({ exportName, data, onHashtagClick, nbData }: HashtagTableProps) => {
  // console.log('re-render HashtagTable');
  const columns = [
    {
      Header: 'Hashtag',
      accessor: 'label',
      size: 3,
      Cell: ({ value }: any) => {
        return (
          <a
            href=" "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onHashtagClick(value);
            }}
          >
            {value}
          </a>
        );
      },
    },
    {
      Header: 'Inauthenticity Probability',
      Cell: () => <small className="rf-tag rf-tag--sm">TODO</small>,
      align: 'center',
      size: 2,
    },
    {
      Header: 'Nb of use',
      accessor: 'value',
      align: 'right',
      Cell: ({ value }: any) => value.toLocaleString('en'),
      size: 1,
    },
  ];

  return (
    <Table<Hashtag>
      title={`Associated Hashtags (${(nbData || data.length).toLocaleString('en')})`}
      columns={columns}
      data={data}
      sortBy={[
        {
          id: 'value',
          desc: true,
        },
      ]}
      layoutFixed
      noScroll
      virtualize={{ height: 1000, itemSize: 56 }}
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(HashtagTable);
