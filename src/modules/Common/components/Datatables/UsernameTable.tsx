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
  [key: string]: any; // FIXME this is because typescript yells when it's not there
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
      size: 3,
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
      size: 1,
      Cell: ({ value }: any) => value.toLocaleString('en'),
    },
  ];

  return (
    <Table<Username>
      title={`Active users (${data.length.toLocaleString('en')})`}
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
