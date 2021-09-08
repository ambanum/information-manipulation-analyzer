import * as React from 'react';

import { GetSearchLanguagesResponse } from '../interfaces';
import LanguageGraph from '../components/Charts/LanguageGraph';
import { LanguageGraphProps } from '../components/Charts/LanguageGraph.d';
import Loading from 'components/Loading';
import useSWR from 'swr';

interface DataLanguageProps {
  queryParamsStringified: string;
  search: string;
  refreshInterval: number;
  onSliceClick: LanguageGraphProps['onSliceClick'];
}

const DataLanguage = ({
  search,
  refreshInterval,
  onSliceClick,
  queryParamsStringified,
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
    <div>
      <LanguageGraph data={languages} onSliceClick={onSliceClick} />
      {/* Add TABLE LanguageTable */}
    </div>
  );
};

export default React.memo(DataLanguage);
