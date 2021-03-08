import { GetHashtagsResponse } from '../interfaces';
import React from 'react';
import Link from 'next/link';
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
        <Link href={`/hashtags/${hashtag.name}`}>
          <a className="rf-tag">{hashtag.name}</a>
        </Link>
      ))}
    </div>
  );
};

export default LastHashtags;
