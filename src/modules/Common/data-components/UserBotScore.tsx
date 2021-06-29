import { GetUserBotScoreResponse } from '../interfaces';
import Link from 'next/link';
import Loading from 'components/Loading';
import React from 'react';
import dayjs from 'dayjs';
import useSwr from 'swr';

type UserBotScoreProps = {
  username: string;
  type?: 'raw' | 'small' | 'full';
} & React.HTMLAttributes<HTMLDivElement>;

const UserBotScore: React.FC<UserBotScoreProps> = React.memo(
  ({ username, type = 'small', ...props }) => {
    const { data, isValidating } = useSwr<GetUserBotScoreResponse>(
      `/api/users/${username}/botscore`
    );

    if (isValidating) {
      return (
        <div {...props}>
          <Loading size="sm" />
        </div>
      );
    }
    if (!data) {
      return <div {...props}>N/A</div>;
    }

    const { score, metadata, updatedAt, provider } = data;

    if (type === 'raw') {
      return (
        <>
          {typeof score !== 'undefined' ? score.toLocaleString('en', { style: 'percent' }) : 'N/A'}
        </>
      );
    }

    if (type === 'full') {
      return (
        <div className="fr-col" {...props}>
          <ul>
            <li>
              <strong>Provider:</strong> {typeof provider !== 'undefined' ? provider : 'N/A'}
            </li>
            <li>
              <strong>Updated at:</strong>{' '}
              {typeof updatedAt !== 'undefined'
                ? dayjs(updatedAt).format('MMMM D, YYYY h:mm A')
                : 'N/A'}
            </li>
            <li>
              <strong>Metadata:</strong>
              {provider === 'peren' && (
                <>
                  {!!metadata ? (
                    <ul>
                      <li>Base value: {metadata?.base_value}</li>
                      <li>Default profile: {metadata?.shap_values?.default_profile}</li>
                      <li>Description length: {metadata?.shap_values?.description_length}</li>
                      <li>Favorite count: {metadata?.shap_values?.favourites_count}</li>
                      <li>Favorite growth rate: {metadata?.shap_values?.favourites_growth_rate}</li>
                      <li>Followers count: {metadata?.shap_values?.followers_count}</li>
                      <li>Followers growth rate: {metadata?.shap_values?.followers_growth_rate}</li>
                      <li>Friends count: {metadata?.shap_values?.friends_count}</li>
                      <li>Friends growth rate: {metadata?.shap_values?.friends_growth_rate}</li>
                      <li>Label: {metadata?.shap_values?.label}</li>
                      <li>Listed count: {metadata?.shap_values?.listed_count}</li>
                      <li>Listed growth rate: {metadata?.shap_values?.listed_growth_rate}</li>
                      <li>Name length: {metadata?.shap_values?.name_length}</li>
                      <li>Num digits in name: {metadata?.shap_values?.num_digits_in_name}</li>
                      <li>
                        Num digits in screen name:{' '}
                        {metadata?.shap_values?.num_digits_in_screen_name}
                      </li>
                      <li>
                        Profile use background image:{' '}
                        {metadata?.shap_values?.profile_use_background_image}
                      </li>
                      <li>Screen name length: {metadata?.shap_values?.screen_name_length}</li>
                      <li>Statuses count: {metadata?.shap_values?.statuses_count}</li>
                      <li>Tweet frequence: {metadata?.shap_values?.tweet_frequence}</li>
                      <li>Verified: {metadata?.shap_values?.verified}</li>
                    </ul>
                  ) : (
                    'N/A'
                  )}
                </>
              )}
              {provider === 'social-networks-bot-finder' && (
                <>
                  {!!metadata ? (
                    <ul>
                      <li>Base value: {metadata?.base_value || 0.75}</li>
                      <li>Age: {metadata?.age}</li>
                      <li>Default profile: {metadata?.default_profile}</li>
                      <li>Description length: {metadata?.description_length}</li>
                      <li>Followers count: {metadata?.followers_count}</li>
                      <li>Followers growth rate: {metadata?.followers_growth_rate}</li>
                      <li>Followers friend ratio: {metadata?.followers_friend_ratio}</li>
                      <li>Friends count: {metadata?.friends_count}</li>
                      <li>Friends growth rate: {metadata?.friends_growth_rate}</li>
                      <li>Friends followers ratio: {metadata?.friends_followers_ratio}</li>
                      <li>Listed count: {metadata?.listed_count}</li>
                      <li>Listed growth rate: {metadata?.listed_growth_rate}</li>
                      <li>Name length: {metadata?.name_length}</li>
                      <li>Num digits in name: {metadata?.name_digits}</li>
                      <li>Screen name length: {metadata?.screenname_length}</li>
                      <li>Num digits in screen name: {metadata?.screen_name_digits}</li>
                      <li>
                        Profile use background image: {metadata?.profile_use_background_image}
                      </li>
                      <li>Statuses count: {metadata?.statuses_count}</li>
                      <li>Tweet frequence: {metadata?.tweet_frequence}</li>
                      <li>Verified: {metadata?.verified}</li>
                    </ul>
                  ) : (
                    'N/A'
                  )}
                </>
              )}
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div {...props}>
        <Link href="/bot-probability">
          <a>
            {typeof score !== 'undefined'
              ? score.toLocaleString('en', { style: 'percent' })
              : 'N/A'}
          </a>
        </Link>
      </div>
    );
  }
);

export default UserBotScore;
