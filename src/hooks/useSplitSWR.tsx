import { isEqual, omit } from 'lodash/fp';

import React from 'react';
import dayjs from 'dayjs';
import { fetcher } from 'utils/api';
import queryString from 'query-string';
import { usePrevious } from 'react-use';
import useSWR from 'swr';

const useSplitSWR = (splitUrl: string | null, { initialData, ...options }: any) => {
  const [data, setData] = React.useState<any>(initialData);
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const { data: splitData, isValidating, error: splitError } = useSWR(splitUrl, options);
  const previousSplitUrl = usePrevious(splitUrl);
  const splitLoading = !splitData || isValidating;

  const urlParams = splitUrl ? queryString.parse(splitUrl.split('?')[1] || '') : {};

  const {
    filters: splittedPeriods,
    search,
    nbTweets,
    nbRetweets,
    nbLikes,
    nbQuotes,
    nbReplies,
  } = splitData || {};

  React.useEffect(() => {
    // in case a new filter has been added, we need to show change the data
    // so we replace all values by 0 until new data has been retrieved
    if (!splitUrl || !previousSplitUrl) {
      return;
    }
    const previousParams = queryString.parse(previousSplitUrl.split('?')[1] || '');
    const params = queryString.parse(splitUrl.split('?')[1] || '');

    if (previousSplitUrl !== splitUrl) {
      if (!isEqual(omit(['min', 'max'])(params), omit(['min', 'max'])(previousParams))) {
        // other than min and max have change
        setData({
          ...initialData,
          volumetry: initialData.volumetry.map((vol: any) => ({
            ...vol,
            nbTweets: 0,
            nbRetweets: 0,
            nbLikes: 0,
            nbQuotes: 0,
            nbReplies: 0,
          })),
        });
      } else if (previousParams.min !== params.min || previousParams.max !== params.max) {
        // min or max have changed, refilter
        const newAggregatedData = {
          ...data,
          nbTweets: 0,
          nbLikes: 0,
          nbRetweets: 0,
          nbReplies: 0,
          nbQuotes: 0,
          nbUsernames: 0,
          nbAssociatedHashtags: 0,
        };

        data.volumetry.forEach((vol: any) => {
          const volumetryDayJs = dayjs(vol.hour);

          if (
            (!urlParams.min && !urlParams.max) ||
            (urlParams.min &&
              urlParams.max &&
              volumetryDayJs.isAfter(dayjs(+urlParams.min)) &&
              volumetryDayJs.isBefore(dayjs(+urlParams.max)))
          ) {
            // Calculate number of tweets
            newAggregatedData.nbTweets += vol.nbTweets;
            newAggregatedData.nbLikes += vol.nbLikes;
            newAggregatedData.nbRetweets += vol.nbRetweets;
            newAggregatedData.nbReplies += vol.nbReplies;
            newAggregatedData.nbQuotes += vol.nbQuotes;
            newAggregatedData.nbUsernames += vol.nbUsernames;
            newAggregatedData.nbAssociatedHashtags += vol.nbAssociatedHashtags;
          }
        });
        setData(newAggregatedData);
      }
    }
  }, [previousSplitUrl, splitUrl, data, urlParams.min, urlParams.max]);

  React.useEffect(() => {
    // When a new split request has been found, retrieve all gathered periods
    if (!splittedPeriods || splitLoading) {
      return;
    }

    let aggregatedData = {
      ...data,
      totalNbTweets: nbTweets,
      totalNbRetweets: nbRetweets,
      totalNbLikes: nbLikes,
      totalNbQuotes: nbQuotes,
      totalNbReplies: nbReplies,
      totalNbUsernames: 0,
      totalNbAssociatedHashtags: 0,
      nbTweets: 0,
      nbRetweets: 0,
      nbLikes: 0,
      nbQuotes: 0,
      nbReplies: 0,
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

          newData.volumetry.forEach((vol: any) => {
            const volumetryDayJs = dayjs(vol.hour);

            if (
              (!urlParams.min && !urlParams.max) ||
              (urlParams.min &&
                urlParams.max &&
                volumetryDayJs.isAfter(dayjs(+urlParams.min)) &&
                volumetryDayJs.isBefore(dayjs(+urlParams.max)))
            ) {
              // Calculate number of tweets
              aggregatedData.nbTweets += vol.nbTweets;
              aggregatedData.nbLikes += vol.nbLikes;
              aggregatedData.nbRetweets += vol.nbRetweets;
              aggregatedData.nbReplies += vol.nbReplies;
              aggregatedData.nbQuotes += vol.nbQuotes;
              aggregatedData.nbUsernames += vol.nbUsernames;
              aggregatedData.nbAssociatedHashtags += vol.nbAssociatedHashtags;
            }
          });

          aggregatedData = {
            ...aggregatedData,
            nbLoaded: aggregatedData.nbLoaded + 1,
            totalNbUsernames: (aggregatedData.nbUsernames || 0) + newData.nbUsernames,
            totalNbAssociatedHashtags:
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
  }, [splitLoading, setLoading, setData, urlParams.min, urlParams.max]);

  return {
    data,
    error: splitError || error,
    loading: loading || splitLoading,
  };
};

export default useSplitSWR;
