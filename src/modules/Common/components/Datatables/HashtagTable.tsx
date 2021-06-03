import { Hashtag, HashtagTableProps } from './HashtagTable.d';

import React from 'react';
import Table from 'components/Table';

const HashtagTable = ({
  exportName,
  data,
  onHashtagClick,
  onHashtagSearchClick,
  nbData,
}: HashtagTableProps) => {
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
      Cell: () => <small className="fr-tag fr-tag--sm">TODO</small>,
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
    {
      Header: 'Action',
      align: 'right',
      Cell: ({ ...rest }: any) => {
        return (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onHashtagSearchClick(rest.row?.original?.label);
            }}
            className="fr-btn fr-btn fr-btn--sm fr-btn--secondary fr-fi-search-line"
            title={`Search ${rest.row?.original?.label}`}
          ></button>
        );
      },
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
