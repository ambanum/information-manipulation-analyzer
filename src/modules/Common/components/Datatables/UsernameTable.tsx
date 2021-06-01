import { Username, UsernameTableProps } from './UsernameTable.d';

import React from 'react';
import Table from 'components/Table';

const UsernameTable = ({ exportName, data, onUsernameClick, nbData }: UsernameTableProps) => {
  // console.log('re-render UsernameTable');
  const columns = [
    {
      Header: 'Username',
      accessor: 'label',
      Cell: ({ value }: any) => {
        return (
          <a href=" " rel="noreferrer noopener" onClick={() => onUsernameClick(value)}>
            {value}
          </a>
        );
      },
      size: 3,
    },
    {
      Header: 'Inauthenticity Probability',
      Cell: () => <small className="fr-tag fr-tag--sm">TODO</small>,
      align: 'center',
      size: 2,
    },
    {
      Header: 'Nb of use',
      accessor: 'value',
      align: 'right',
      size: 1,
      Cell: ({ value }: any) => value.toLocaleString('en'),
    },
  ];

  return (
    <Table<Username>
      title={`Active users (${(nbData || data.length).toLocaleString('en')})`}
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
      exportable={{ name: exportName }}
    />
  );
};

export default React.memo(UsernameTable);
