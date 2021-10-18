import { isEqual, omit } from 'lodash/fp';

import React from 'react';
import { fetcher } from 'utils/api';
import queryString from 'query-string';
import { usePrevious } from 'react-use';
import useSWR from 'swr';

const useSplitSWR = (splitUrl: string | null, options: any) => {
  const [data, setData] = React.useState<any>(options.initialData);
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const { data: splitData, isValidating, error: splitError } = useSWR(splitUrl, options);
  const previousSplitUrl = usePrevious(splitUrl);
  const splitLoading = !splitData || isValidating;

  const { filters: splittedPeriods, search, nbTweets } = splitData || {};

  React.useEffect(() => {
    // in case a new filter has been added, we need to show change the data
    // so we replace all values by 0 until new data has been retrieved
    if (!splitUrl || !previousSplitUrl) {
      return;
    }
    const previousParams = queryString.parse(previousSplitUrl.split('?')[1] || '');
    const params = queryString.parse(splitUrl.split('?')[1] || '');

    if (
      previousSplitUrl !== splitUrl &&
      !isEqual(omit(['min', 'max'])(params), omit(['min', 'max'])(previousParams))
    ) {
      setData({
        ...options.initialData,
        volumetry: options.initialData.volumetry.map((vol: any) => ({
          ...vol,
          data: vol.data.map((d: any) => ({ ...d, y: 0 })),
        })),
      });
    }
  }, [previousSplitUrl, splitUrl]);

  React.useEffect(() => {
    // When a new split request has been found, retrieve all gathered periods
    if (!splittedPeriods || splitLoading) {
      return;
    }

    let aggregatedData = {
      ...data,
      nbTweets,
      search,
      nbUsernames: 0,
      nbAssociatedHashtags: 0,
      nbLoaded: 0,
      nbToLoad: splittedPeriods.length,
    };

    setLoading(true);
    setData(aggregatedData);

    const doFetchPeriods = async () => {
      for (const { name, startDate, endDate, ...period } of splittedPeriods) {
        const params: any = {
          ...period,
        };
        if (startDate) params.min = new Date(startDate).getTime();
        if (endDate) params.max = new Date(endDate).getTime();

        const searchParams = new URLSearchParams(params).toString();
        try {
          const newData = await fetcher(
            `/api/searches/${encodeURIComponent(name)}${searchParams ? `?${searchParams}` : ''}`,
            {}
          );

          aggregatedData = {
            ...aggregatedData,
            nbLoaded: aggregatedData.nbLoaded + 1,
            nbUsernames: (aggregatedData.nbUsernames || 0) + newData.nbUsernames,
            nbAssociatedHashtags:
              (aggregatedData.nbAssociatedHashtags || 0) + newData.nbAssociatedHashtags,
            volumetry: [...(aggregatedData.volumetry || []), ...newData.volumetry].sort(
              (a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime()
            ),
          };

          setData(aggregatedData);
          setError(undefined);
        } catch (e: any) {
          setError(e.toString());
        }
      }
      setLoading(false);
    };
    doFetchPeriods();
  }, [splitLoading, setLoading, setData]);

  return {
    data,
    error: splitError || error,
    loading: loading || splitLoading,
  };
};

export default useSplitSWR;
