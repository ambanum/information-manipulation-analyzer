import { GetHashtagsResponse } from '../interfaces';
import Link from 'next/link';
import Loading from 'components/Loading';
import React from 'react';
import useSWR from 'swr';

interface LastHashtagsProps {
  // TODO
}

const LastHashtags = ({ ...props }: LastHashtagsProps & React.HTMLAttributes<HTMLDivElement>) => {
  const { data } = useSWR<GetHashtagsResponse>('/api/hashtags', { refreshInterval: 1000 * 1 * 60 });

  if (!data) {
    return <div>Loading...</div>;
  }

  const hashtags = data?.hashtags || [];

  return (
    <div {...props}>
      {hashtags.map((hashtag) => (
        <Link key={hashtag._id} href={`/hashtags/${hashtag.name}`}>
          <a className={`rf-tag rf-m-1v`}>
            {hashtag.name}
            {hashtag.status !== 'DONE' ? <Loading size="sm" className="rf-ml-2v" /> : null}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default LastHashtags;
