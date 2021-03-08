import React from 'react';

export interface SearchProps {
  label?: React.ReactNode;
  placeholder?: string;
  buttonLabel: string;
  onSubmit: (searchString: string) => void;
}

// https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217186376/Barre+de+recherche+-+Search+bar

const Search = ({
  label,
  placeholder,
  buttonLabel,
  onSubmit,
  ...props
}: IProps & React.HTMLAttributes<HTMLDivElement>) => {
  const [search, setSearch] = React.useState('');

  const handleChange = (event: any) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    onSubmit(search);
  };

  return (
    <div className="rf-search-bar" {...props}>
      {label && <label className="rf-label">{label}</label>}
      <input
        className="rf-input"
        placeholder={placeholder}
        type="search"
        name="search-input-input"
        onChange={handleChange}
      />
      <button className="rf-btn" title={buttonLabel} onClick={handleSubmit}>
        {buttonLabel}
      </button>
    </div>
  );
};

export default Search;
