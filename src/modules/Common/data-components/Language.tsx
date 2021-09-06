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
  const { data, isValidating } = useSWR<GetSearchLanguagesResponse>(
    `/api/searches/${encodeURIComponent(search)}/languages${queryParamsStringified}`,
    {
      refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  if (isValidating || !data) {
    return <Loading />;
  }

  return (
    <div>
      <LanguageGraph data={data?.languages || []} onSliceClick={onSliceClick} />
      {/* Add TABLE LanguageTable */}
    </div>
  );
};

export default React.memo(DataLanguage);
