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
                      <li>
                        <strong>Base value: </strong>
                        {metadata?.base_value || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The value that would be predicted by the algorithm if it did not have
                          access to the features to make the prediction.)
                        </span>
                      </li>
                      <li>
                        <strong>Age: </strong>
                        {metadata?.age || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The age, in days, of the account - this is rounded up to avoid any
                          possible division by zero. Most bots have a very small age and only serve
                          for a short time.)
                        </span>
                      </li>
                      <li>
                        <strong>Default profile: </strong>
                        {metadata?.default_profile || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (Whether the account has uploaded a new profile picture or chosen to rely
                          on the default picture. This makes it possible to discriminate against the
                          most primitive bots, which do not change their profile pictures. It should
                          be noted that today the most advanced bots use computer-generated images
                          or images available on the Internet.)
                        </span>
                      </li>
                      <li>
                        <strong>Description length: </strong>
                        {metadata?.description_length || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The length, in number of characters, of the description of an account.
                          For a number of rather simple bots, description_length is 0 because they
                          have not filled in this part.)
                        </span>
                      </li>
                      <li>
                        <strong>Followers count: </strong>
                        {metadata?.followers_count || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The number of followers of the account. This feature is also interesting:
                          bots often have a lot of trouble getting followers, and an account with
                          many followers is unlikely to be a bot.)
                        </span>
                      </li>
                      <li>
                        <strong>Followers growth rate: </strong>
                        {metadata?.followers_growth_rate || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The growth rate of the number of followers - i.e. the ratio of the number
                          of followers to the age of the account. One of the most important
                          features. Bots often acquire their followers very quickly in the first
                          moments of account use.)
                        </span>
                      </li>
                      <li>
                        <strong>Followers friend ratio: </strong>
                        {metadata?.followers_friend_ratio || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The ratio number of subscribers/(number of subscriptions +1).)
                        </span>
                      </li>
                      <li>
                        <strong>Friends count: </strong>
                        {metadata?.friends_count || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The number of accounts tracked by the account under study. Some very
                          simple bots do not manage to follow enough accounts to be credible.)
                        </span>
                      </li>
                      <li>
                        <strong>Friends growth rate: </strong>
                        {metadata?.friends_growth_rate || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The growth rate of the number of subscriptions - i.e. the ratio of the
                          number of subscriptions to the age of the account. Bots often acquire
                          their followers very quickly in the first moments of account use.)
                        </span>
                      </li>
                      <li>
                        <strong>Friends followers ratio: </strong>
                        {metadata?.friends_followers_ratio || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The ratio of number of subscriptions/(number of subscribers +1). This
                          ratio is most often between 0.8 and 1.3 for human accounts.)
                        </span>
                      </li>
                      <li>
                        <strong>Listed count: </strong>
                        {metadata?.listed_count || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The number of public lists of which the account is a member. Many bots do
                          not have this feature built into their code: listed_count will therefore
                          be 0 and will be a relevant indicator.)
                        </span>
                      </li>
                      <li>
                        <strong>Listed count grow rate: </strong>
                        {metadata?.listed_count_growth_rate || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The growth rate of the number of lists to which the account belongs -
                          i.e. the ratio of the number of lists to the age of the account. Bots
                          often acquire their followers very quickly in the first moments of account
                          use.)
                        </span>
                      </li>
                      <li>
                        <strong>Favorite count: </strong>
                        {metadata?.favorite_count || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The number of tweets bookmarked by the account. This feature gives an
                          additional clue: a large or small number of favorites is an interesting
                          indicator of whether the account is potentially a bot.)
                        </span>
                      </li>
                      <li>
                        <strong>Favorite growth rate: </strong>
                        {metadata?.favourites_growth_rate || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The growth rate of the number of tweets bookmarked - i.e. the ratio of
                          the number of tweets bookmarked to the age of the account. Bots often
                          acquire their followers very quickly in the first moments of account use.)
                        </span>
                      </li>
                      <li>
                        <strong>Listed growth rate: </strong>
                        {metadata?.listed_growth_rate || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The growth rate of the number of lists to which the account belongs -
                          i.e. the ratio of the number of lists to the age of the account.)
                        </span>
                      </li>
                      <li>
                        <strong>Name length: </strong>
                        {metadata?.name_length || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The length, in number of characters, of the username (@name) of the
                          account. Bots tend to have generated names and therefore often long so as
                          not to come across a name already assigned by twitter. The more advanced
                          generations of names do not have this type of defect.)
                        </span>
                      </li>
                      <li>
                        <strong>Num digits in name: </strong>
                        {metadata?.name_digits || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The number of digits in the username (@name). The simplest generated
                          names tend to have many digits in their name.)
                        </span>
                      </li>
                      <li>
                        <strong>Screen name length: </strong>
                        {metadata?.screenname_length || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The length, in number of characters, of the account display name. As
                          above, these names are often generated and the length is in some cases a
                          good indicator of generation.)
                        </span>
                      </li>
                      <li>
                        <strong>Num digits in screen name: </strong>
                        {metadata?.screen_name_digits || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The number of digits contained in the display name. The simplest
                          generated names tend to have a lot of numbers in their name.)
                        </span>
                      </li>
                      <li>
                        <strong>Profile use background image: </strong>
                        {metadata?.profile_use_background_image || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (Whether or not the account has loaded a banner image. Again, the simplest
                          bots don't bother to make this change.)
                        </span>
                      </li>
                      <li>
                        <strong>Statuses count:</strong>{' '}
                        {metadata?.statuses_count || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The number of statuses (tweets) posted by the account. This feature is
                          interesting in many cases: for example, an account with a large number of
                          statuses relative to its age is often more likely to be categorised as
                          human.)
                        </span>
                      </li>
                      <li>
                        <strong>Tweet frequence: </strong>
                        {metadata?.tweet_frequence || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (The frequency with which an account tweets - i.e. the ratio of the number
                          of tweets to the age of the account. This is a good indicator for spotting
                          spambots that are sometimes frenetically active.)
                        </span>
                      </li>
                      <li>
                        <strong>Verified: </strong>
                        {metadata?.verified || 'not provided'}
                        <br />
                        <span className="fr-text--sm">
                          (Whether or not the account has obtained Twitter certification. In this
                          case of course the account is automatically recognised as human.)
                        </span>
                      </li>
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
