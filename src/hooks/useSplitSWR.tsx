import React from 'react';
import { batchedPromiseAll } from 'batched-promise-all';
import { fetcher } from 'utils/api';
import useSWR from 'swr';
const useSplitSWR = (splitUrl: string | null, { initialData, ...options }: any) => {
  const [data, setData] = React.useState<any>(initialData);
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const { data: splitData, isValidating, error: splitError } = useSWR(splitUrl, options);
  const splitLoading = !splitData || isValidating;

  const { filters: splittedPeriods, search } = splitData || {};

  React.useEffect(() => {
    // When a new split request has been found, retrieve all gathered periods
    if (!splittedPeriods || splitLoading) {
      return;
    }

    let aggregatedData = {
      volumetry: [],
      totalNbTweets: splitData.nbTweets,
      totalNbRetweets: 0,
      totalNbLikes: 0,
      totalNbQuotes: 0,
      totalNbReplies: 0,
      totalNbUsernames: 0,
      totalNbAssociatedHashtags: 0,
      search,
      nbLoaded: 0,
      nbToLoad: splittedPeriods.length,
    };

    setLoading(true);
    setData(aggregatedData);

    const doFetchPeriods = async () => {
      await batchedPromiseAll(
        // this will be 4x slower and consume 1/4 of memory compared to the Promise.all(array.map(...))
        splittedPeriods,
        async ({ name, startDate, endDate, ...period }: any) => {
          // your iterator callback-same as you would use for .map method on your array
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
              totalNbUsernames: aggregatedData.totalNbUsernames + newData.nbUsernames,
              totalNbRetweets: aggregatedData.totalNbRetweets + newData.nbRetweets,
              totalNbLikes: aggregatedData.totalNbLikes + newData.nbLikes,
              totalNbQuotes: aggregatedData.totalNbQuotes + newData.nbQuotes,
              totalNbReplies: aggregatedData.totalNbReplies + newData.nbReplies,
              totalNbAssociatedHashtags:
                aggregatedData.totalNbAssociatedHashtags + newData.nbAssociatedHashtags,
              // @ts-ignore
              volumetry: [...(aggregatedData.volumetry || []), ...newData.volumetry].sort(
                (a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime()
              ),
            };

            setData(aggregatedData);
            setError(undefined);
          } catch (e: any) {
            setError(e.toString());
          }
        },
        6 // max connections https://docs.pushtechnology.com/cloud/latest/manual/html/designguide/solution/support/connection_limitations.html#:~:text=Most%20modern%20browsers%20allow%20six,the%20reason%20for%20browser%20limits.
      );

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
