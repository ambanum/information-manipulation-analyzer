import * as React from 'react';

import { GetSearchTweetsResponse } from '../interfaces';
import Loading from 'components/Loading';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import useSWR from 'swr';

dayjs.extend(localizedFormat);

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
        {/* <p className="fr-mb-0">Lorem ipsum</p> */}
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {firstTweets.map(({ id, date }) => (
          <div className="fr-col">
            <span className="fr-text--sm">
              <strong>{dayjs(date).format('llll')}</strong>
            </span>
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>

      <div className="fr-mt-4w fr-mb-2w">
        <h4 className="fr-mb-1v">Most retweeted tweets</h4>
        {/* <p className="fr-mb-0">Lorem ipsum</p> */}
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {mostRetweetedTweets.map(({ id, retweetCount }) => (
          <div className="fr-col">
            <span className="fr-text--sm">
              <strong>{retweetCount} RT</strong>
            </span>
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>

      <div className="fr-mt-4w fr-mb-2w">
        <h4 className="fr-mb-1v">Most liked tweets</h4>
        {/* <p className="fr-mb-0">Lorem ipsum</p> */}
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {mostLikedTweets.map(({ id, likeCount }) => (
          <div className="fr-col">
            <span className="fr-text--sm">
              <strong>{likeCount} likes</strong>
            </span>
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>

      <div className="fr-mt-4w fr-mb-2w">
        <h4 className="fr-mb-1v">Most quoted tweets</h4>
        {/* <p className="fr-mb-0">Lorem ipsum</p> */}
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {mostQuotedTweets.map(({ id, quoteCount }) => (
          <div className="fr-col">
            <span className="fr-text--sm">
              <strong>{quoteCount} quotes</strong>
            </span>
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>

      <div className="fr-mt-4w fr-mb-2w">
        <h4 className="fr-mb-1v">Most commented tweets</h4>
        {/* <p className="fr-mb-0">Lorem ipsum</p> */}
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {mostCommentedTweets.map(({ id, replyCount }) => (
          <div className="fr-col">
            <span className="fr-text--sm">
              <strong>{replyCount} replies</strong>
            </span>
            <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(Tweets);
