import { Outlink, OutlinksTableProps } from './OutlinksTable.d';

import React from 'react';
import Table from 'components/Table';

const OutlinksTable = ({ exportName, data, nbData }: OutlinksTableProps) => {
  const columns = [
    {
      Header: 'Outlinks',
      accessor: 'url',
      Cell: ({ value }: Outlink) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`https://www.google.com/s2/favicons?domain=${value}`}
            className="fr-mr-2v"
            width="16"
            height="16"
          />
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </div>
      ),
      size: 3,
    },
    {
      Header: 'Number of appearances',
      accessor: 'count',
      align: 'right',
      size: 1,
    },
  ];

  return (
    <Table<Outlink>
      title="Outlinks"
      subtitle={`${(nbData || data.length).toLocaleString('en')} outlinks by number of appearances`}
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
