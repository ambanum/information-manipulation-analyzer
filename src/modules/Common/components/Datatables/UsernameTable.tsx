import React from 'react';
import Table from 'components/Table';

export interface UsernameTableOptions {
  onUsernameClick: (username: string) => any;
}

export interface UsernameTableProps {
  data: Username[];
  options: UsernameTableOptions;
}

export interface Username {
  id: string;
  label: string;
  value: string;
}

const UsernameTable = ({ data, options }: UsernameTableProps) => {
  const columns = [
    {
      Header: 'Username',
      accessor: 'label',
      Cell: ({ value }: any) => {
        return (
          <a href=" " rel="noreferrer noopener" onClick={() => options.onUsernameClick(value)}>
            {value}
          </a>
        );
      },
      size: 2,
    },
    {
      Header: 'Bot Probability',
      Cell: () => 'TODO',
      align: 'center',
      size: 1,
    },
    {
      Header: 'Nb of use',
      accessor: 'value',
      align: 'right',
      size: 1,
    },
  ];

  return (
    <Table
      title={`Active users (${data.length})`}
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
    />
  );
};

export default React.memo(UsernameTable);
