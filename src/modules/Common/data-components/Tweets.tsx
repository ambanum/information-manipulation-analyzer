import * as React from 'react';

import Loading from 'components/Loading';
import { TwitterTweetEmbed } from 'react-twitter-embed';

interface TweetsProps {}

const Tweets = ({}: TweetsProps) => {
  const dataFirstTweets = ['1439889669110521859', '1439924306163666952', '1439903412150226946'];
  const dataMostInfueantialTweets = [
    '1439676282275463169',
    '1439920476432879619',
    '1439930989791391750',
  ];

  if (!dataFirstTweets && !dataMostInfueantialTweets) {
    return <Loading />;
  }

  return (
    <>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">The 3 first tweets</h4>
        <p className="fr-mb-0">Lorem ipsum</p>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {dataFirstTweets.map((id) => {
          return (
            <div className="fr-col">
              <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
            </div>
          );
        })}
      </div>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">Most influential tweets</h4>
        <p className="fr-mb-0">Lorem ipsum</p>
      </div>
      <div className="fr-grid-row fr-grid-row--gutters">
        {dataMostInfueantialTweets.map((id) => {
          return (
            <div className="fr-col">
              <TwitterTweetEmbed tweetId={id} placeholder={<Loading size="sm" />} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default React.memo(Tweets);
