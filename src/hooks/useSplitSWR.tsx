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
  const [loaded, setLoaded] = React.useState(false);
  const { data: splitData, isValidating, error: splitError } = useSWR(splitUrl, options);
  const previousSplitUrl = usePrevious(splitUrl);
  const splitLoading = !splitData || isValidating;

  const { filters: splittedPeriods, search, nbTweets } = splitData || {};

  React.useEffect(() => {
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
      setLoaded(false);
    }
  }, [previousSplitUrl, splitUrl, loaded]);

  React.useEffect(() => {
    if (!splittedPeriods || splitLoading || loaded) {
      return;
    }

    let aggregatedData = {
      ...data,
      nbTweets,
      search,
      nbLoaded: 0,
      nbToLoad: splittedPeriods.length,
    };

    setLoading(true);
    setData(aggregatedData);

    const doFetchPeriods = async () => {
      for (const { name, ...period } of splittedPeriods) {
        const params: any = {};
        if (period.startDate) params.min = new Date(period.startDate).getTime();
        if (period.endDate) params.max = new Date(period.endDate).getTime();
        if (period.lang) params.lang = period.lang;

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
            volumetry: newData.volumetry.map((volumetryLine: any, i: number) => {
              const newArray = [
                ...((aggregatedData?.volumetry || [])[i]?.data || []),
                ...volumetryLine.data,
              ].sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

              return {
                ...volumetryLine,
                data: newArray,
              };
            }),
          };

          setData(aggregatedData);
          setError(undefined);
        } catch (e: any) {
          setError(e.toString());
        }
      }
      setLoading(false);
      setLoaded(true);
    };
    doFetchPeriods();
  }, [splitLoading, setLoading, setData, setLoaded, loaded]);

  return {
    data,
    error: splitError || error,
    loading: loading || splitLoading,
  };
};

export default useSplitSWR;
