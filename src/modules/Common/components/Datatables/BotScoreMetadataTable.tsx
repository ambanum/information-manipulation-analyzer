import { BotScoreMetadata, BotScoreMetadataTableProps } from './BotScoreMetadataTable.d';

import React from 'react';
import Table from 'components/Table';

const BotScoreMetadataTable = ({ exportName, data }: BotScoreMetadataTableProps) => {
  const columns = [
    {
      Header: 'Features',
      accessor: 'title',
      size: 1,
    },
    {
      Header: 'Value',
      accessor: 'value',
      align: 'left',
      size: 1,
    },
    {
      Header: 'Description',
      accessor: 'description',
      align: 'left',
      size: 3,
    },
  ];

  return (
    <Table<BotScoreMetadata>
      title="Test"
      hideTitle={true}
      subtitle="Provider : "
      columns={columns}
      data={data}
      layoutFixed
      noScroll
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(BotScoreMetadataTable);
