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
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  id: string;
  label: string;
  value: string;
}

const HashtagTable = ({ data }: HashtagTableProps) => {
  const columns = [
    {
      Header: 'Hashtag',
      accessor: 'label',
      size: 3,
    },
    {
      Header: 'Inauthenticity Probability',
      Cell: () => <small className="rf-tag rf-tag--sm">TODO</small>,
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
  ];

  return (
    <Table<Hashtag>
      title={`Associated Hashtags (${data.length.toLocaleString('en')})`}
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
