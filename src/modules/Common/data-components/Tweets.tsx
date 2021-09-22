import * as React from 'react';

import { GetSearchTweetsResponse } from '../interfaces';
import Loading from 'components/Loading';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import useSWR from 'swr';

interface DataTweetsProps {
  search: string;
  refreshInterval: number;
  queryParamsStringified?: string;
}
const Tweets = ({ search, refreshInterval, queryParamsStringified = '' }: DataTweetsProps) => {
  const { data } = useSWR<GetSearchTweetsResponse>(
    `/api/searches/${encodeURIComponent(search)}/tweets${queryParamsStringified}`,
    {
      refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  const {
    firstTweets = [],
    mostRetweetedTweets = [],

    mostLikedTweets = [],
    mostQuotedTweets = [],
    mostCommentedTweets = [],
  } = data || {};

  if (firstTweets.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">The 3 first tweets</h4>
        <p className="fr-mb-0">Lorem ipsum</p>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {firstTweets.map(({ id }) => (
          <div className="fr-col">
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">Most retweeted tweets</h4>
        <p className="fr-mb-0">Lorem ipsum</p>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {mostRetweetedTweets.map(({ id }) => (
          <div className="fr-col">
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">Most liked tweets</h4>
        <p className="fr-mb-0">Lorem ipsum</p>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {mostLikedTweets.map(({ id }) => (
          <div className="fr-col">
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">Most quoted tweets</h4>
        <p className="fr-mb-0">Lorem ipsum</p>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {mostQuotedTweets.map(({ id }) => (
          <div className="fr-col">
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">Most commented tweets</h4>
        <p className="fr-mb-0">Lorem ipsum</p>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {mostCommentedTweets.map(({ id }) => (
          <div className="fr-col">
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(Tweets);
