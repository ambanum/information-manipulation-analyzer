import { Username, UsernameTableProps } from './UsernameTable.d';

import { RiFilterLine as IconFilter } from 'react-icons/ri';
import React from 'react';
import Table from 'components/Table';
import UserBotScore from 'modules/Common/data-components/UserBotScore';
import UserData from 'modules/Common/data-components/UserData';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

const UsernameTable = ({
  exportName,
  data,
  onUsernameClick,
  onUsernameViewClick,
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
      size: 3,
    },
    {
      Header: 'Followers',
      accessor: 'followersCount',
      canSort: true,
      sortType: 'number',
      align: 'right',
      size: 1,
    },
    {
      Header: 'Account creation date',
      accessor: ({ creationDate }: Username) => dayjs(creationDate).toDate(),
      sortType: 'datetime',
      Cell: ({ value }: any) => (
        <div>
          {dayjs(value).format('ll')}
          <br />
          {dayjs(value).fromNow()}
        </div>
      ),
      align: 'right',
      size: 2,
    },
    {
      Header: 'Bot score',
      canSort: true,
      sortType: 'number',
      Cell: ({ row }: any) => {
        return <UserBotScore username={row?.original?.label} type="raw" />;
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
                  onUsernameViewClick(row?.original?.label);
                }}
              ></button>
            </li>
            <li>
              <button
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-fi-search-line fr-btn--icon-left"
                title={`Search @${row?.original?.label}`}
                onClick={() => {
                  onUsernameSearchClick(row?.original?.label);
                }}
              ></button>
            </li>
            <li>
              <button
                disabled={true}
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-btn--icon-left"
                style={{ paddingLeft: '0.56rem', paddingRight: '0.56rem' }}
                title={`Filter by @${row?.original?.label}`}
              >
                <IconFilter style={{ color: 'var(--g600-g400)' }} />
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
      title={`Active users`}
      subtitle={`${(nbData || data.length).toLocaleString('en')} users listed by number of use`}
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
      virtualize={{ height: 500, itemSize: 100 }}
      exportable={{ name: exportName }}
    />
  );
};

export default React.memo(UsernameTable);
