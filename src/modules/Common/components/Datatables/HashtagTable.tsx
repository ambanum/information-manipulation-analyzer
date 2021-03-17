import React from 'react';
// import { ResponsiveLine, Serie, PointMouseHandler } from '@nivo/line';
// import { LegendMouseHandler } from '@nivo/legends';
import Table from 'components/Table';
export interface HashtagTableOptions {
  // onClick?: PointMouseHandler;
}

export interface HashtagTableProps {
  data: Hashtag[];
  options?: HashtagTableOptions;
}

export interface Hashtag {
  id: string;
  label: string;
  value: string;
}

const HashtagTable = ({ data, options = {} }: HashtagTableProps) => {
  const columns = [
    {
      Header: 'Hashtag',
      accessor: 'label',
      size: 2,
    },
    {
      Header: 'Nb of use',
      accessor: 'value',
      align: 'right',
    },
  ];

  return (
    <Table
      title={`Associated Hashtags (${data.length})`}
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
    />
  );
};

export default React.memo(HashtagTable);
