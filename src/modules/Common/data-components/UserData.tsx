import { GetUserResponse } from '../interfaces';
import React from 'react';
import TwitterDataCard from '../components/TwitterDataCard';
import useSwr from 'swr';

type UserDataProps = {
  username: string;
  onUsernameClick: (username: string) => any;
} & React.HTMLAttributes<HTMLDivElement>;

const UserData: React.FC<UserDataProps> = React.memo(({ username, onUsernameClick, ...props }) => {
  const { data, isValidating } = useSwr<GetUserResponse>(`/api/users/${username}`);

  if (isValidating) {
    return <TwitterDataCard loading username={`@${username}`} onUsernameClick={onUsernameClick} />;
  }

  if (!data) {
    return (
      <div>
        <TwitterDataCard username={`@${username}`} onUsernameClick={onUsernameClick} />
      </div>
    );
  }

  const { user } = data;

  return (
    <div {...props}>
      <TwitterDataCard
        displayname={user?.displayname}
        onUsernameClick={onUsernameClick}
        username={`@${username}`}
        image={user?.profileImageUrl || 'https://via.placeholder.com/30/DDDDDD/FFFFFF/?text=%20'}
        nbFollowers={user?.followersCount}
        verified={user?.verified}
        created={user?.created}
      />
    </div>
  );
});

export default UserData;
