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
              {typeof metadata !== 'undefined' ? (
                <ul>
                  <li>
                    Base value:{' '}
                    {typeof metadata.base_value !== 'undefined' ? metadata.base_value : 'N/A'}
                  </li>
                  <li>
                    Default profile:{' '}
                    {typeof metadata.shap_values.default_profile !== 'undefined'
                      ? metadata.shap_values.default_profile
                      : 'N/A'}
                  </li>
                  <li>
                    Description length:{' '}
                    {typeof metadata.shap_values.description_length !== 'undefined'
                      ? metadata.shap_values.description_length
                      : 'N/A'}
                  </li>
                  <li>
                    Favorite count:{' '}
                    {typeof metadata.shap_values.favourites_count !== 'undefined'
                      ? metadata.shap_values.favourites_count
                      : 'N/A'}
                  </li>
                  <li>
                    Favorite growth rate:{' '}
                    {typeof metadata.shap_values.favourites_growth_rate !== 'undefined'
                      ? metadata.shap_values.favourites_growth_rate
                      : 'N/A'}
                  </li>
                  <li>
                    Followers count:{' '}
                    {typeof metadata.shap_values.followers_count !== 'undefined'
                      ? metadata.shap_values.followers_count
                      : 'N/A'}
                  </li>
                  <li>
                    Followers growth rate:{' '}
                    {typeof metadata.shap_values.followers_growth_rate !== 'undefined'
                      ? metadata.shap_values.followers_growth_rate
                      : 'N/A'}
                  </li>
                  <li>
                    Friends count:{' '}
                    {typeof metadata.shap_values.friends_count !== 'undefined'
                      ? metadata.shap_values.friends_count
                      : 'N/A'}
                  </li>
                  <li>
                    Friends growth rate:{' '}
                    {typeof metadata.shap_values.friends_growth_rate !== 'undefined'
                      ? metadata.shap_values.friends_growth_rate
                      : 'N/A'}
                  </li>
                  <li>
                    Label:{' '}
                    {typeof metadata.shap_values.label !== 'undefined'
                      ? metadata.shap_values.label
                      : 'N/A'}
                  </li>
                  <li>
                    Listed count:{' '}
                    {typeof metadata.shap_values.listed_count !== 'undefined'
                      ? metadata.shap_values.listed_count
                      : 'N/A'}
                  </li>
                  <li>
                    Listed growth rate:{' '}
                    {typeof metadata.shap_values.listed_growth_rate !== 'undefined'
                      ? metadata.shap_values.listed_growth_rate
                      : 'N/A'}
                  </li>
                  <li>
                    Name length:{' '}
                    {typeof metadata.shap_values.name_length !== 'undefined'
                      ? metadata.shap_values.name_length
                      : 'N/A'}
                  </li>
                  <li>
                    Num digits in name:{' '}
                    {typeof metadata.shap_values.num_digits_in_name !== 'undefined'
                      ? metadata.shap_values.num_digits_in_name
                      : 'N/A'}
                  </li>
                  <li>
                    Num digits in screen name:{' '}
                    {typeof metadata.shap_values.num_digits_in_screen_name !== 'undefined'
                      ? metadata.shap_values.num_digits_in_screen_name
                      : 'N/A'}
                  </li>
                  <li>
                    Profile use background image:{' '}
                    {typeof metadata.shap_values.profile_use_background_image !== 'undefined'
                      ? metadata.shap_values.profile_use_background_image
                      : 'N/A'}
                  </li>
                  <li>
                    Screen name length:{' '}
                    {typeof metadata.shap_values.screen_name_length !== 'undefined'
                      ? metadata.shap_values.screen_name_length
                      : 'N/A'}
                  </li>
                  <li>
                    Statuses count:{' '}
                    {typeof metadata.shap_values.statuses_count !== 'undefined'
                      ? metadata.shap_values.statuses_count
                      : 'N/A'}
                  </li>
                  <li>
                    Tweet frequence:{' '}
                    {typeof metadata.shap_values.tweet_frequence !== 'undefined'
                      ? metadata.shap_values.tweet_frequence
                      : 'N/A'}
                  </li>
                  <li>
                    Verified:{' '}
                    {typeof metadata.shap_values.verified !== 'undefined'
                      ? metadata.shap_values.verified
                      : 'N/A'}
                  </li>
                </ul>
              ) : (
                'N/A'
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
