import { Username, UsernameTableProps } from './UsernameTable.d';

import Link from 'next/link';
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
      Header: 'Bot Prob.',
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
      Cell: ({ ...rest }: any) => {
        return (
          <Link href={`/user/@${rest.row?.original?.label}`}>
            <button
              className="fr-btn fr-btn fr-btn--sm fr-btn--secondary fr-fi-search-line"
              title={`View details of @${rest.row?.original?.label}`}
              onClick={() => {
                onUsernameSearchClick(rest.row?.original?.label);
              }}
            ></button>
          </Link>
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
      virtualize={{ height: 1000, itemSize: 80 }}
      exportable={{ name: exportName }}
    />
  );
};

export default React.memo(UsernameTable);
