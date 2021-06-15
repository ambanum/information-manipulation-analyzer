import { GetUserBotScoreResponse } from '../interfaces';
import Loading from 'components/Loading';
import React from 'react';
import useSwr from 'swr';

type UserBotScoreProps = {
  username: string;
} & React.HTMLAttributes<HTMLDivElement>;

const UserBotScore: React.FC<UserBotScoreProps> = React.memo(({ username, ...props }) => {
  const { data, isValidating } = useSwr<GetUserBotScoreResponse>(`/api/users/${username}/botscore`);

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

  const { score } = data;

  return (
    <div
      {...props}
      style={{ color: score && score > 0.75 ? 'red' : score && score > 0.5 ? 'orange' : 'gray' }}
    >
      {typeof score !== 'undefined' ? score.toLocaleString('en', { style: 'percent' }) : 'N/A'}
    </div>
  );
});

export default UserBotScore;
