import React, { PropsWithChildren, ReactElement } from 'react';
import {
  useTable,
  TableOptions,
  useSortBy,
  UseSortByState,
  UseSortByColumnProps,
} from 'react-table';
import styles from './Table.module.scss';

// https://codesandbox.io/s/github/ggascoigne/react-table-example?file=/src/Table/Table.tsx

export interface TableProps<T extends Record<string, unknown>> extends TableOptions<T> {
  title: string;
  bordered?: boolean;
  noScroll?: boolean;
  layoutFixed?: boolean;
  hideTitle?: boolean; // only use title for accessibility
  sortBy?: UseSortByState<T>['sortBy'];
}

const hooks = [useSortBy];
export interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
  extends UseSortByColumnProps<D> {}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  title,
  sortBy: initialSortBy,
  bordered = false,
  noScroll = false,
  layoutFixed = false,
  hideTitle = false,
}: PropsWithChildren<TableProps<T>>): ReactElement {
  const initialState: any = React.useMemo(() => (initialSortBy ? { sortBy: initialSortBy } : {}), [
    initialSortBy,
  ]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialState,
    },
    ...hooks
  );

  return (
    <table
      className={`rf-table
        ${styles.table}
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
            {headerGroup.headers.map((column) => {
              // @ts-ignore
              const sortByProps = column.getSortByToggleProps();
              // @ts-ignore
              const { isSorted, isSortedDesc, headerClassName } = column;
              const headerProps = column.getHeaderProps(sortByProps);

              return (
                <th
                  {...headerProps}
                  className={`${
                    isSorted
                      ? isSortedDesc
                        ? 'react-table--sorted-down'
                        : 'react-table--sorted-up'
                      : ''
                  } ${headerClassName || ''}`}
                >
                  {column.render('Header')}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
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
