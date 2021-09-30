import { Language, LanguageTableProps } from './LanguageTable.d';

import { RiFilterLine as IconFilter } from 'react-icons/ri';
import Number from 'components/Number';
import React from 'react';
import Table from 'components/Table';

const LanguageTable = ({ exportName, data, title, subtitle, onFilter }: LanguageTableProps) => {
  const columns = [
    {
      Header: 'Language',
      accessor: 'label',
      size: 3,
    },
    {
      sortType: 'number',
      Header: 'Nb of tweets',
      accessor: 'value',
      Cell: ({ value }: any) => value.toLocaleString('en'),
      align: 'right',
      size: 1,
    },
    {
      sortType: 'number',
      Header: 'Percentage',
      accessor: 'percentage',
      Cell: ({ row }: any) => (
        <Number value={row?.original?.percentage} percent={true} precision={3} />
      ),
      align: 'right',
      size: 1,
    },
    {
      Header: 'Actions',
      align: 'right',
      Cell: ({ row }: any) => {
        return (
          <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--right fr-btns-group--inline">
            <li>
              <button
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-btn--icon-left"
                style={{ paddingLeft: '0.56rem', paddingRight: '0.56rem' }}
                title={`Filter by ${row?.original?.label}`}
                onClick={() => onFilter(row?.original?.id)}
              >
                <IconFilter style={{ color: 'var(--g600-g400)' }} />
              </button>
            </li>
          </ul>
        );
      },
      size: 1,
    },
  ];

  return (
    <Table<Language>
      columns={columns}
      data={data}
      title={title}
      subtitle={subtitle}
      sortBy={[
        {
          id: 'percentage',
          desc: true,
        },
      ]}
      virtualize={{ height: 500, itemSize: 56 }}
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(LanguageTable);
