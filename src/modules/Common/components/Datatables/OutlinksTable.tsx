import { Outlink, OutlinksTableProps } from './OutlinksTable.d';

import React from 'react';
import Table from 'components/Table';

const OutlinksTable = ({ exportName, data, nbData }: OutlinksTableProps) => {
  const columns = [
    {
      Header: 'Outlinks',
      accessor: 'url',
      Cell: ({ value }: Outlink) => (
        <>
          <img src={`https://www.google.com/s2/favicons?domain=${value}`} className="fr-mr-2v" />
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </>
      ),
      size: 3,
    },
    {
      Header: 'Count',
      accessor: 'count',
      align: 'right',
      size: 1,
    },
  ];

  return (
    <Table<Outlink>
      title={`${(nbData || data.length).toLocaleString('en')} outlinks`}
      subtitle="Lorem ipsum"
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
      virtualize={{ height: 500, itemSize: 56 }}
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(OutlinksTable);
