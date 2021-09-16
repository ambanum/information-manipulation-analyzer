import { Username, UsernameTableProps } from './UsernameTable.d';

import { RiFilterLine as IconFilter } from 'react-icons/ri';
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
      Header: 'User info',
      accessor: 'label',
      Cell: ({ value }: any) => {
        return <UserData username={value} onUsernameClick={() => onUsernameClick(value)} />;
      },
      size: 6,
    },
    {
      Header: 'Bot probability',
      Cell: ({ row }: any) => {
        return <UserBotScore username={row?.original?.label} />;
      },
      align: 'right',
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
      Header: 'Actions',
      align: 'right',
      Cell: ({ row }: any) => {
        return (
          <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--right fr-btns-group--inline">
            <li>
              <button
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-fi-account-line fr-btn--icon-left"
                title={`View complete profile of @${row?.original?.label}`}
                onClick={() => {
                  onUsernameSearchClick(row?.original?.label);
                }}
              ></button>
            </li>
            <li>
              <button
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-fi-search-line fr-btn--icon-left"
                title={`Search @${row?.original?.label}`}
              ></button>
            </li>
            <li>
              <button
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-btn--icon-left"
                style={{ paddingLeft: '0.56rem', paddingRight: '0.56rem' }}
                title={`Filter by @${row?.original?.label}`}
              >
                <IconFilter style={{ color: 'var(--bf500)' }} />
              </button>
            </li>
          </ul>
        );
      },
      size: 2,
    },
  ];

  return (
    <Table<Username>
      title={`${(nbData || data.length).toLocaleString('en')} active users`}
      subtitle="Active user are user who tweeted this term"
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
