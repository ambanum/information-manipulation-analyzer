import * as React from 'react';

import { GetSearchLanguagesResponse } from '../interfaces';
import LanguageGraph from '../components/Charts/LanguageGraph';
import { LanguageGraphProps } from '../components/Charts/LanguageGraph.d';
import LanguageTable from '../components/Datatables/LanguageTable';
import { LanguageTableProps } from '../components/Datatables/LanguageTable.d';
import Loading from 'components/Loading';
import useSWR from 'swr';

interface DataLanguageProps {
  queryParamsStringified: string;
  search: string;
  refreshInterval: number;
  onSliceClick: LanguageGraphProps['onSliceClick'];
  exportName: LanguageTableProps['exportName'];
}

const DataLanguage = ({
  search,
  refreshInterval,
  onSliceClick,
  queryParamsStringified,
  exportName,
}: DataLanguageProps) => {
  const { data } = useSWR<GetSearchLanguagesResponse>(
    `/api/searches/${encodeURIComponent(search)}/languages${queryParamsStringified}`,
    {
      refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  if (!data) {
    return <Loading />;
  }

  const languages = data?.languages || [];
  if (languages.length === 0) {
    return null;
  }

  return (
    <div className="fr-col">
      <LanguageGraph data={languages} onSliceClick={onSliceClick} />
      <div className="fr-mt-2w">
        <LanguageTable
          title={`${languages.length} languages used`}
          subtitle="Every languages used listed"
          data={languages}
          exportName={exportName}
        />
      </div>
    </div>
  );
};

export default React.memo(DataLanguage);
