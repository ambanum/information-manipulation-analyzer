import React from 'react';
import { fetcher } from 'utils/api';
import useSWR from 'swr';

const useSplitSWR = (splitUrl: string | null, options: any) => {
  const [data, setData] = React.useState<any>(options.initialData);
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const { data: splitData, isValidating, error: splitError } = useSWR(splitUrl, options);
  const splitLoading = !splitData || isValidating;

  const { filters: splittedPeriods, search, nbTweets } = splitData || {};

  React.useEffect(() => {
    if (!splittedPeriods || splitLoading) {
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
