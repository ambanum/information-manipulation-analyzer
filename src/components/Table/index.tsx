import { PropsWithChildren, ReactElement } from 'react';
import { useTable, TableOptions, Row } from 'react-table';

// https://codesandbox.io/s/github/ggascoigne/react-table-example?file=/src/Table/Table.tsx

export interface TableProps<T extends Record<string, unknown>> extends TableOptions<T> {
  title: string;
  bordered?: boolean;
  noScroll?: boolean;
  layoutFixed?: boolean;
  hideTitle?: boolean; // only use title for accessibility
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  title,
  bordered = false,
  noScroll = false,
  layoutFixed = false,
  hideTitle = false,
}: PropsWithChildren<TableProps<T>>): ReactElement {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <table
      className={`rf-table 
        ${hideTitle ? 'rf-table--no-caption' : ''}
        ${bordered ? 'rf-table--bordered' : ''}
        ${layoutFixed ? 'rf-table--layout-fixed' : ''}
        ${noScroll ? 'rf-table--no-scroll' : ''}`}
      {...getTableProps()}
    >
      <caption>{title}</caption>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
