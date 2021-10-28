import Alert from 'modules/Common/components/Alert/Alert';
import React from 'react';
import classNames from 'classnames';
import s from './Search.module.css';

export interface SearchProps {
  label?: React.ReactNode;
  className?: string;
  placeholder?: string;
  buttonLabel: string;
  onSearchSubmit: (searchString: string) => any;
  onSearchChange: (searchString: string) => any;
}

// https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217186376/Barre+de+recherche+-+Search+bar

const Search = ({
  label,
  className,
  placeholder,
  buttonLabel,
  onSearchSubmit,
  onSearchChange,
  ...props
}: SearchProps & React.HTMLAttributes<HTMLDivElement>) => {
  const [search, setSearch] = React.useState('');
  const inputRef = React.useRef(null);

  const handleChange = (event: any) => {
    setSearch(event.target.value);
    onSearchChange(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    onSearchSubmit(search);
  };

  return (
    <div className={classNames(s.search, className)}>
      <div
        className={classNames(
          'fr-container fr-container--fluid fr-p-4w fr-p-md-12w',
          s.search,
          className
        )}
      >
        <div className="fr-grid-row">
          <div className="fr-col">
            <p className="text-center fr-text--lead fr-mt-0 fr-mb-2w">
              What do you want to search?
            </p>
            <div className="fr-search-bar fr-search-bar--lg fr-mx-md-12w" {...props} role="search">
              {label && <label className="fr-label">{label}</label>}
              <input
                ref={inputRef}
                className={classNames('fr-input', s.searchInput)}
                placeholder={placeholder}
                type="search"
                name="search-input-input"
                onChange={handleChange}
              />
              <button className="fr-btn" title={buttonLabel} onClick={handleSubmit}>
                {buttonLabel}
              </button>
            </div>
            {search.includes(' ') && !search.match(/^".*"$/) && (
              <Alert size="small" className="fr-mt-2w">
                Note that if you want to search an exact sentence, you need to use
                <button
                  className="fr-ml-1w"
                  style={{ fontSize: '1rem' }}
                  onClick={() => {
                    const quotedValue = `"${search}"`.replace('""', '"');
                    // @ts-ignore
                    inputRef.current.value = quotedValue;
                    setSearch(quotedValue);
                    onSearchChange(quotedValue);
                  }}
                >
                  <strong>"{search}"</strong>
                </button>
              </Alert>
            )}
            <p className="fr-text--sm text-center fr-mt-1w fr-mb-0">
              <em>Finally get a real idea on whether a trend is worth the hype</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
