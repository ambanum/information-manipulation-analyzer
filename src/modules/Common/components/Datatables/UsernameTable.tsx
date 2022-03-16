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
  onUsernameFilterClick,
  nbData,
  nbPerPage,
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
      Cell: ({ value }: any) => value.toLocaleString('en'),
      size: 1,
    },
    {
      Header: 'Verified',
      accessor: 'verified',
      canSort: true,
      align: 'center',
      sortType: 'basic',
      size: 0.25,
      Cell: ({ value }: any) =>
        value ? (
          <svg
            viewBox="0 0 24 24"
            aria-label="Verified account"
            fill="rgb(29, 161, 242)"
            style={{ width: '20px' }}
          >
            <g>
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
            </g>
          </svg>
        ) : (
          '-'
        ),
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
      Header: (
        <>
          Nb of
          <br />
          use
        </>
      ),
      accessor: 'value',
      align: 'right',
      size: 1,
      Cell: ({ value }: any) => value.toLocaleString('en'),
    },
    {
      Header: (
        <>
          % of all
          <br />
          tweets
        </>
      ),
      accessor: 'percentage',
      align: 'right',
      size: 1,
      Cell: ({ value }: any) =>
        value.toLocaleString('en', { style: 'percent', maximumFractionDigits: 2 }),
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
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-btn--icon-left"
                style={{ paddingLeft: '0.56rem', paddingRight: '0.56rem' }}
                title={`Filter by @${row?.original?.label}`}
                onClick={() => {
                  onUsernameFilterClick(row?.original?.label);
                }}
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

  const nbUsernames = nbData || data.length;
  const additionalInfo =
    nbPerPage && nbUsernames > nbPerPage ? (
      <>
        <br />
        <small> ℹ Only the first {nbPerPage} are listed here</small>
      </>
    ) : (
      ''
    );
  return (
    <Table<Username>
      title={`Active users`}
      subtitle={
        <>
          <strong>{(nbData || data.length).toLocaleString('en')}</strong> users listed by number of
          use - <strong>{data.filter((user) => user.verified).length.toLocaleString('en')}</strong>{' '}
          verified users{additionalInfo}
        </>
      }
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
