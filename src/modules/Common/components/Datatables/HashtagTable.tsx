import { Hashtag, HashtagTableProps } from './HashtagTable.d';

import { RiFilterLine as IconFilter } from 'react-icons/ri';
import React from 'react';
import Table from 'components/Table';

const HashtagTable = ({
  exportName,
  data,
  onHashtagClick,
  onHashtagSearchClick,
  onHashtagFilterClick,
  nbData,
}: HashtagTableProps) => {
  const columns = [
    {
      Header: 'Hashtag',
      accessor: 'label',
      size: 3,
      Cell: ({ value }: any) => {
        return (
          <a
            href=" "
            target="_blank"
            title={`View #${value} on Twitter`}
            rel="noreferrer noopener"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onHashtagClick(value);
            }}
          >
            #{value}
          </a>
        );
      },
    },
    {
      Header: 'Nb of use',
      accessor: 'value',
      align: 'right',
      Cell: ({ value }: any) => value.toLocaleString('en'),
      size: 1,
    },
    {
      Header: 'Actions',
      align: 'right',
      Cell: ({ ...rest }: any) => {
        return (
          <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--right fr-btns-group--inline">
            <li>
              <button
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-fi-search-line fr-btn--icon-left"
                title={`Search #${rest.row?.original?.label}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onHashtagSearchClick(rest.row?.original?.label);
                }}
              ></button>
            </li>
            <li>
              <button
                type="button"
                className="fr-btn fr-btn fr-btn--secondary fr-btn--icon-left"
                style={{ paddingLeft: '0.56rem', paddingRight: '0.56rem' }}
                title={`Filter by ${rest.row?.original?.label}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onHashtagFilterClick(rest.row?.original?.label);
                }}
              >
                <IconFilter style={{ color: 'var(--bf500)' }} />
              </button>
            </li>
          </ul>
        );
      },
      size: 1,
    },
  ];

  const nbHashtags = nbData || data.length;
  const additionalInfo =
    nbHashtags > 1000 ? <small> ℹ Only the first 1000 are listed here</small> : '';

  return (
    <Table<Hashtag>
      title="Associated hashtags"
      subtitle={
        <>
          {nbHashtags.toLocaleString('en')} hashtags listed by number of use{additionalInfo}
        </>
      }
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
      virtualize={{ height: 500, itemSize: 56 }}
      exportable={{
        name: exportName,
      }}
    />
  );
};

export default React.memo(HashtagTable);
