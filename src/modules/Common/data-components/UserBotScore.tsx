import { GetUserBotScoreResponse } from '../interfaces';
import React from 'react';
import useSwr from 'swr';

type UserBotScoreProps = {
  username: string;
} & React.HTMLAttributes<HTMLDivElement>;

const UserBotScore: React.FC<UserBotScoreProps> = React.memo(({ username, ...props }) => {
  const { data, isValidating } = useSwr<GetUserBotScoreResponse>(`/api/users/${username}/botscore`);

  if (isValidating) {
    return <small {...props}>...</small>;
  }
  if (!data) {
    return <small {...props}>N/A</small>;
  }

  const { score } = data;

  return <small {...props}>{score}</small>;
});

export default UserBotScore;
