import * as LanguageManager from 'modules/Countries/managers/LanguageManager';

import FilterItem from 'modules/Common/components/Filters/FilterItem';
import Filters from 'modules/Common/components/Filters/Filters';
import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import useUrl from 'hooks/useUrl';

dayjs.extend(localizedFormat);

type UrlFiltersProps = {
  // TODO
} & React.HTMLAttributes<HTMLDivElement>;

const UrlFilters: React.FC<UrlFiltersProps> = ({ children, className, ...props }) => {
  const { queryParams, removeQueryParams } = useUrl();

  const nbParams = Object.keys(queryParams).length;
  if (nbParams === 0) {
    return null;
  }
  const { min, max, lang, username, hashtag, content } = queryParams;

  return (
    <Filters className={classNames(className)} {...props}>
      {(min || max) && (
        <FilterItem onRemove={() => removeQueryParams(['min', 'max'])}>
          <span>
            {min && dayjs(+min).format('lll')}
            {max && ' → '}
            {max && dayjs(+max).format('lll')}
          </span>
        </FilterItem>
      )}
      {lang && (
        <FilterItem onRemove={() => removeQueryParams(['lang'])}>
          {LanguageManager.getName(lang)}
        </FilterItem>
      )}
      {username && (
        <FilterItem onRemove={() => removeQueryParams(['username'])}>@{username}</FilterItem>
      )}
      {hashtag && (
        <FilterItem onRemove={() => removeQueryParams(['hashtag'])}>#{hashtag}</FilterItem>
      )}
      {content && (
        <FilterItem onRemove={() => removeQueryParams(['content'])}>"{content}"</FilterItem>
      )}
    </Filters>
  );
};

export default UrlFilters;
