import * as LanguageManager from 'modules/Countries/managers/LanguageManager';

import { FiCalendar } from 'react-icons/fi';
import FilterItem from 'modules/Common/components/Filters/FilterItem';
import Filters from 'modules/Common/components/Filters/Filters';
import { MdRecordVoiceOver } from 'react-icons/md';
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
  const { min, max, lang } = queryParams;

  return (
    <Filters className={classNames(className)} {...props}>
      {(min || max) && (
        <FilterItem onRemove={() => removeQueryParams(['min', 'max'])}>
          {/* <FiCalendar /> */}
          <span>
            {min && dayjs(+min).format('lll')}
            {max && ' → '}
            {max && dayjs(+max).format('lll')}
          </span>
        </FilterItem>
      )}
      {lang && (
        <FilterItem onRemove={() => removeQueryParams(['lang'])}>
          {/* <MdRecordVoiceOver /> */}
          {LanguageManager.getName(lang)}
        </FilterItem>
      )}
    </Filters>
  );
};

export default UrlFilters;
