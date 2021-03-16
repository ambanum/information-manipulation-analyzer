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
    },
    {
      Header: 'Nb of use',
      accessor: 'value',
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
    />
  );
};

export default React.memo(HashtagTable);
