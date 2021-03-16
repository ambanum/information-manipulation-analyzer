import React from 'react';
// import { ResponsiveLine, Serie, PointMouseHandler } from '@nivo/line';
// import { LegendMouseHandler } from '@nivo/legends';
import Table from 'components/Table';
export interface UsernameTableOptions {
  // onClick?: PointMouseHandler;
}

export interface UsernameTableProps {
  data: Username[];
  options?: UsernameTableOptions;
}

export interface Username {
  id: string;
  label: string;
  value: string;
}

const UsernameTable = ({ data, options = {} }: UsernameTableProps) => {
  const columns = [
    {
      Header: 'Username',
      accessor: 'label',
    },
    {
      Header: 'Nb of use',
      accessor: 'value',
    },
    {
      Header: 'Bot Probability',
      Cell: () => 'TODO',
    },
  ];

  return (
    <Table
      title={`Active users (${data.length})`}
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

export default React.memo(UsernameTable);
