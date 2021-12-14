import { TweetContent, TweetContentTableProps } from './TweetContentTable.d';
import { RiFilterLine as IconFilter } from 'react-icons/ri';

import React from 'react';
import Table from 'components/Table';

const TweetContentsTable = ({ exportName, data, nbData, onFilter }: TweetContentTableProps) => {
  const columns = [
    {
      Header: 'Content',
      accessor: 'content',
      size: 4,
      style: { whiteSpace: 'normal', overflowY: 'auto', lineHeight: '1.3em' },
    },
    {
      Header: (
        <span>
          Number of <br />
          appearances
        </span>
      ),
      accessor: 'count',
      align: 'right',
      sortType: 'number',
      Cell: ({ value }: any) => value.toLocaleString('en'),
      size: 1,
      style: { minWidth: 0 },
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
                className="fr-btn fr-btn fr-btn--secondary fr-btn--icon-left"
                style={{ paddingLeft: '0.56rem', paddingRight: '0.56rem' }}
                title={`Filter by tweet content`}
                onClick={() => onFilter(row?.original?.content)}
              >
                <IconFilter style={{ color: 'var(--bf500)' }} />
              </button>
            </li>
          </ul>
        );
      },
      size: 1,
      style: { minWidth: 0 },
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
      virtualize={{ height: 500, itemSize: 120 }}
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(TweetContentsTable);
