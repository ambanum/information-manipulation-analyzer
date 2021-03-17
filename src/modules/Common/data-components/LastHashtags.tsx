import { GetHashtagsResponse } from '../interfaces';
import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';

interface LastHashtagsProps {
  // TODO
}

const LastHashtags = ({ ...props }: LastHashtagsProps & React.HTMLAttributes<HTMLDivElement>) => {
  const { data } = useSWR<GetHashtagsResponse>('/api/hashtags');

  if (!data) {
    return <div>Loading...</div>;
  }

  const hashtags = data?.hashtags || [];

  return (
    <div {...props}>
      {hashtags.map((hashtag) => (
        <Link key={hashtag._id} href={`/hashtags/${hashtag.name}`}>
          <a className={`rf-tag rf-m-1v`}>{hashtag.name}</a>
        </Link>
      ))}
    </div>
  );
};

export default LastHashtags;
