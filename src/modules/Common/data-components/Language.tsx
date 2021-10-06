import * as React from 'react';

import Alert from '../components/Alert/Alert';
import { GetSearchLanguagesResponse } from '../interfaces';
import LanguageTable from '../components/Datatables/LanguageTable';
import { LanguageTableProps } from '../components/Datatables/LanguageTable.d';
import Loading from 'components/Loading';
import PieChart from '../components/Charts/PieChart';
import useSWR from 'swr';

interface DataLanguageProps {
  queryParamsStringified: string;
  search: string;
  refreshInterval: number;
  onLanguageClick: LanguageTableProps['onLanguageClick'];
  onFilter: LanguageTableProps['onFilter'];
  exportName: LanguageTableProps['exportName'];
}

const DataLanguage = ({
  search,
  refreshInterval,
  onLanguageClick,
  onFilter,
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
    return (
      <Alert size="small" type="info">
        No languages found.
      </Alert>
    );
  }

  return (
    <div className="fr-col">
      <PieChart
        title="Most used languages"
        subTitle="By percentage of use, views on pie chart"
        data={languages}
      />
      <div className="fr-mt-8w">
        <LanguageTable
          title={`Languages`}
          subtitle={`${languages.length} languages listed by percentage of use`}
          data={languages}
          exportName={exportName}
          onFilter={onFilter}
          onLanguageClick={onLanguageClick}
        />
      </div>
    </div>
  );
};

export default React.memo(DataLanguage);
