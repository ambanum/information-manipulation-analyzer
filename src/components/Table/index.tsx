import { Column, Row, TableOptions, UseSortByState, useSortBy, useTable } from 'react-table';
import {
  RiArrowDownSLine as IconSmallArrowDown,
  RiArrowUpSLine as IconSmallArrowUp,
} from 'react-icons/ri';
import React, { PropsWithChildren, ReactElement } from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import classNames from 'classnames';
import styles from './Table.module.css';
import { useRouter } from 'next/router';

// https://codesandbox.io/s/github/ggascoigne/react-table-example?file=/src/Table/Table.tsx

const getAlignClass = (alignment: string) => {
  if (!alignment) {
    return '';
  }
  if (alignment === 'left') return `justify-start text-left`;
  if (alignment === 'right') return `justify-end text-right`;
  return `justify-${alignment} text-${alignment}`;
};

const getSizeClass = (size: number) => {
  if (!size) {
    return '';
  }
  return `flex-${size}`;
};

export interface VirtualizeProps {
  height: number;
  itemSize: number;
}

export interface TableProps<T extends Record<string, unknown>> extends TableOptions<T> {
  title?: string;
  subtitle?: React.ReactNode;
  bordered?: boolean;
  noScroll?: boolean;
  layoutFixed?: boolean;
  exportable?: false | { name: string };
  hideTitle?: boolean; // only use title for accessibility
  sortBy?: UseSortByState<T>['sortBy'];
  virtualize?: VirtualizeProps;
  disableSortRemove?: boolean;
}

const hooks = [useSortBy];

const downloadCSVData =
  <T extends object>({
    name,
    columns,
    data,
  }: {
    name: string;
    columns: Readonly<Column<T>[]>;
    data: Readonly<T[]>;
  }): any =>
  () => {
    const headerNames = [columns.map((c) => c.Header)];
    const accessors = columns.map((c) => c.accessor);
    const tableRows = data.map((dataRow) =>
      accessors.map((accessor) => (dataRow as any)[accessor])
    );
    const footerColumns = [columns.map((c) => (c as any).footerValue)];

    const rows = headerNames.concat(tableRows).concat(footerColumns);

    const csvContent = rows.map((row) => row.join(';')).join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURI(csvContent)}`;
    link.download = `${name.toLowerCase()}.csv`;
    link.click();
  };

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  title,
  subtitle,
  sortBy: initialSortBy,
  bordered = false,
  noScroll = false,
  layoutFixed = false,
  hideTitle = false,
  exportable = false,
  virtualize,
  disableSortRemove = true,
}: PropsWithChildren<TableProps<T>>): ReactElement {
  const initialState: any = React.useMemo(
    () => (initialSortBy ? { sortBy: initialSortBy } : {}),
    [initialSortBy]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      //@ts-ignore
      disableSortRemove,
      columns,
      data,
      initialState,
    },
    ...hooks
  );
  const InsideRow = ({ row, style = {} }: { row: Row<T>; style?: React.CSSProperties }) => {
    return (
      <div
        {...row.getRowProps({
          style,
        })}
        className="tr"
      >
        {row.cells.map((cell) => {
          let { className = '', style = {}, ...cellProps } = cell.getCellProps();

          className = `${className} ${
            //@ts-ignore
            getAlignClass(cell.column.align)
          } ${
            //@ts-ignore
            getSizeClass(cell.column.size)
          }`;
          return (
            <div
              className={`td ${className}`}
              style={{ ...style, ...((cell.column as any).style || {}) }}
              {...cellProps}
            >
              {cell.render('Cell')}
            </div>
          );
        })}
      </div>
    );
  };

  const RenderVirtualizedRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return <InsideRow row={row} style={style} />;
    },
    [prepareRow, rows]
  );

  const RenderNormalRow = React.useCallback(
    ({ row }) => {
      prepareRow(row);
      return <InsideRow row={row} style={{}} />;
    },
    [prepareRow, rows]
  );

  const shouldVirtualize = !!virtualize && rows.length > 10;

  const router = useRouter();

  return (
    <div
      className={`fr-table 
        ${styles.table}
        ${hideTitle ? 'fr-table--no-caption' : ''}
        ${bordered ? 'fr-table--bordered' : ''}
        ${layoutFixed ? 'fr-table--layout-fixed' : ''}
        ${noScroll ? 'fr-table--no-scroll' : ''}`}
      {...getTableProps()}
    >
      <div className="table">
        <div className={`caption ${styles.caption}`} role="caption">
          <div>
            {title && <h4 className="fr-mb-1v">{title}</h4>}
            {subtitle && (
              <p className="fr-mb-0" style={{ fontWeight: 'normal' }}>
                {subtitle}
              </p>
            )}
          </div>
          {!!exportable && (
            <a
              className="fr-link fr-link--sm fr-fi-download-line fr-link--icon-left"
              title="Download data as CSV"
              onClick={downloadCSVData<T>({ columns, data, name: exportable.name })}
              href={router.asPath}
            >
              CSV
            </a>
          )}
        </div>
        <div className="thead">
          {headerGroups.map((headerGroup) => (
            <div className="tr" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                // @ts-ignore
                const sortByProps = column.getSortByToggleProps();
                // @ts-ignore
                const { isSorted, isSortedDesc, headerClassName, canSort, style } = column;
                const headerProps = column.getHeaderProps(sortByProps);

                //@ts-ignore
                const alignClasses = getAlignClass(column.align);
                //@ts-ignore
                const sizeClasses = getSizeClass(column.size);

                //Sortable arrows icons colors
                // let colorUp = 'var(--g500)';
                // let colorDown = 'var(--g500)';

                // if (canSort && isSorted) {
                //   if (isSortedDesc) {
                //     colorUp = 'var(--bf500)';
                //     colorDown = 'var(--g500)';
                //   } else {
                //     colorUp = 'var(--g500)';
                //     colorDown = 'var(--bf500)';
                //   }
                // }

                let colorUp =
                  canSort && isSorted
                    ? isSortedDesc
                      ? 'var(--bf500)'
                      : 'var(--g500)'
                    : 'var(--g500)';
                let colorDown =
                  canSort && isSorted
                    ? isSortedDesc
                      ? 'var(--g500)'
                      : 'var(--bf500)'
                    : 'var(--g500)';

                return (
                  <div
                    {...headerProps}
                    className={classNames(
                      'th',
                      styles.th,
                      canSort ? styles.th__sortable : '',
                      isSorted
                        ? isSortedDesc
                          ? styles.th__sortedDown
                          : styles.th__sortedUp
                        : styles.th__notSorted,
                      headerClassName,
                      alignClasses,
                      sizeClasses
                    )}
                    style={{ ...((column as any).style || {}) }}
                  >
                    <div>{column.render('Header')}</div>

                    {canSort && (
                      <div className={classNames(styles.iconSortable, 'fr-ml-1v')}>
                        <IconSmallArrowUp size="0.875rem" style={{ color: colorUp }} />
                        <IconSmallArrowDown size="0.875rem" style={{ color: colorDown }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="tbody" {...getTableBodyProps()}>
          {!shouldVirtualize && rows.map((row) => <RenderNormalRow key={row.id} row={row} />)}
          {shouldVirtualize && (
            <div style={{ height: virtualize?.height || 500 }}>
              <AutoSizer>
                {({ width }) => (
                  <FixedSizeList
                    height={virtualize?.height || 500}
                    itemCount={rows.length}
                    itemSize={virtualize?.itemSize || 56}
                    width={width}
                  >
                    {RenderVirtualizedRow}
                  </FixedSizeList>
                )}
              </AutoSizer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
