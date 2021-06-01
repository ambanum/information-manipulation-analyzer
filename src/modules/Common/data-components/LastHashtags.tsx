import { GetHashtagsResponse } from '../interfaces';
import Link from 'next/link';
import Loading from 'components/Loading';
import React from 'react';
import useSwr from 'swr';

interface LastHashtagsProps {
  // TODO
}

const LastHashtags = ({ ...props }: LastHashtagsProps & React.HTMLAttributes<HTMLDivElement>) => {
  const { data } = useSwr<GetHashtagsResponse>('/api/hashtags', { refreshInterval: 1000 * 1 * 60 });

  if (!data) {
    return <Loading />;
  }

  const hashtags = data?.hashtags || [];

  let firstLetter: string;

  return (
    <div {...props}>
      {hashtags.map((hashtag) => {
        const newFirstLetter = hashtag.name[0];
        let title = null;
        if (newFirstLetter !== firstLetter) {
          title = <h3 className="fr-m-1v fr-mt-3v">{newFirstLetter.toUpperCase()}</h3>;
          firstLetter = newFirstLetter;
        }

        return (
          <React.Fragment key={`last_hashtag_${hashtag.name}`}>
            {title}
            <Link key={hashtag._id} href={`/hashtags/${hashtag.name}`} prefetch={false}>
              <a className={`fr-tag fr-m-1v`}>
                #{hashtag.name}
                {!['DONE', 'DONE_ERROR'].includes(hashtag.status) ? (
                  <Loading size="sm" className="fr-ml-2v" />
                ) : hashtag.status === 'DONE_ERROR' ? (
                  <span
                    className="fr-fi-alert-fill fr-text-color--error"
                    aria-hidden="true"
                    title={hashtag.error}
                  ></span>
                ) : null}
              </a>
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LastHashtags;
