import { Username, UsernameTableProps } from './UsernameTable.d';

import React from 'react';
import Table from 'components/Table';
import UserBotScore from 'modules/Common/data-components/UserBotScore';
import UserData from 'modules/Common/data-components/UserData';

const UsernameTable = ({
  exportName,
  data,
  onUsernameClick,
  onUsernameSearchClick,
  nbData,
}: UsernameTableProps) => {
  const columns = [
    {
      Header: 'Username',
      accessor: 'label',
      Cell: ({ value }: any) => {
        return <UserData username={value} onUsernameClick={() => onUsernameClick(value)} />;
      },
      size: 6,
    },
    {
      Header: 'Bot prob.',
      Cell: ({ row }: any) => {
        return <UserBotScore username={row?.original?.label} />;
      },
      align: 'center',
      size: 1,
    },
    {
      Header: 'Nb of use',
      accessor: 'value',
      align: 'right',
      size: 1,
      Cell: ({ value }: any) => value.toLocaleString('en'),
    },
    {
      Header: 'Action',
      align: 'right',
      Cell: ({ row }: any) => {
        return (
          <button
            type="button"
            className="fr-btn fr-btn fr-btn--sm fr-btn--secondary fr-fi-account-line fr-btn--icon-left"
            title={`View details of @${row?.original?.label}`}
            onClick={() => {
              onUsernameSearchClick(row?.original?.label);
            }}
          >
            View
          </button>
        );
      },
      size: 1,
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
      virtualize={{ height: 1000, itemSize: 100 }}
      exportable={{ name: exportName }}
    />
  );
};

export default React.memo(UsernameTable);
