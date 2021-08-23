import { GetSearchesResponse, Search } from '../interfaces';

import Alert from '../components/Alert/Alert';
import Card from 'components/Card';
import Link from 'next/link';
import Loading from 'components/Loading';
import React from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSwr from 'swr';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface LastSearchesProps {
  filter?: string;
}

const TagsList = ({ searches, keyIndex }: { searches: Search[]; keyIndex?: number }) => {
  let firstLetter: string;
  let title: any = null;
  const nbSearches = searches.length;

  return (
    <>
      {searches.map((search) => {
        if (typeof keyIndex !== 'undefined' && nbSearches > 10) {
          const newFirstLetter = search.name[keyIndex];
          if (newFirstLetter !== firstLetter) {
            title = <h3 className="fr-m-1v fr-mt-3v">{newFirstLetter.toUpperCase()}</h3>;
            firstLetter = newFirstLetter;
          }
        }

        const loading = !['DONE', 'DONE_ERROR'].includes(search.status);
        const timeInfo = loading
          ? dayjs(search.createdAt).fromNow()
          : dayjs(search.createdAt).format('llll');

        return (
          <React.Fragment key={`last_search_${search.name}`}>
            {title}
            <Link
              key={search._id}
              href={`/searches/${encodeURIComponent(search.name)}`}
              prefetch={false}
            >
              <a className={`fr-tag fr-m-1v`} title={`Created ${timeInfo}`}>
                {search.name}
                {loading ? (
                  <Loading size="sm" className="fr-ml-2v" />
                ) : search.status === 'DONE_ERROR' ? (
                  <span
                    className="fr-fi-alert-fill fr-text-color--error"
                    aria-hidden="true"
                    title={search.error}
                  ></span>
                ) : null}
              </a>
            </Link>
          </React.Fragment>
        );
      })}
    </>
  );
};

const LastSearches = ({
  filter,
  ...props
}: LastSearchesProps & React.HTMLAttributes<HTMLDivElement>) => {
  const { data } = useSwr<GetSearchesResponse>('/api/searches', { refreshInterval: 1000 * 1 * 60 });

  if (!data) {
    return <Loading />;
  }

  const searches = data?.searches || [];

  const filteredSearches = filter
    ? searches.filter((search) => new RegExp(filter, 'i').test(search.name))
    : searches;

  const hashtags = filteredSearches.filter((search) => search.type === 'HASHTAG');
  const keywords = filteredSearches.filter((search) => search.type === 'KEYWORD');
  const mentions = filteredSearches.filter((search) => search.type === 'MENTION');
  const cashtags = filteredSearches.filter((search) => search.type === 'CASHTAG');
  const urls = filteredSearches.filter((search) => search.type === 'URL');

  return (
    <div {...props}>
      {filter && (
        <Alert size="small" className="fr-mt-2w">
          All searches containing <strong>{filter}</strong>
        </Alert>
      )}
      {hashtags.length > 0 && (
        <>
          <h2 className="fr-mt-6w fr-mb-2w fr-ml-1v">#Hashtags</h2>
          <TagsList searches={hashtags} keyIndex={1} />
        </>
      )}
      {keywords.length > 0 && (
        <>
          <h2 className="fr-mt-6w fr-mb-2w fr-ml-1v">Keywords</h2>
          <TagsList searches={keywords} keyIndex={0} />
        </>
      )}
      {mentions.length > 0 && (
        <>
          <h2 className="fr-mt-6w fr-mb-2w fr-ml-1v">@Mentions</h2>
          <TagsList searches={mentions} keyIndex={1} />
        </>
      )}
      {cashtags.length > 0 && (
        <>
          <h2 className="fr-mt-6w fr-mb-2w fr-ml-1v">$Cashtags</h2>
          <TagsList searches={cashtags} keyIndex={1} />
        </>
      )}
      {urls.length > 0 && (
        <>
          <h2 className="fr-mt-6w fr-mb-2w fr-ml-1v">Urls</h2>
          <div className="fr-container fr-container--fluid">
            <div className="fr-grid-row fr-grid-row--gutters">
              {urls.map(({ metadata, name }) => (
                <div className="fr-col fr-col-md-4" key={name}>
                  <Card
                    enlargeLink
                    direction="right"
                    href={`/searches/${encodeURIComponent(name)}`}
                    title={metadata?.url?.title}
                    description={metadata?.url?.description}
                    image={
                      metadata?.url?.image?.url ||
                      'https://via.placeholder.com/150/333333/333333/?text='
                    }
                    imageAlt={metadata?.url?.title}
                  />
                </div>
              ))}
            </div>{' '}
          </div>
        </>
      )}
    </div>
  );
};

export default LastSearches;
