import * as React from 'react';

import Alert from '../components/Alert/Alert';
import { GetSearchTweetContentsResponse } from '../interfaces';
import Loading from 'components/Loading';
import TweetContentTable from '../components/Datatables/TweetContentTable';
import { TweetContentTableProps } from '../components/Datatables/TweetContentTable.d';
import useSWR from 'swr';

interface DataCoordinatedInauthenticBehavior {
  search: string;
  queryParamsStringified?: string;
  exportName: TweetContentTableProps['exportName'];
}

const DataCoordinatedInauthenticBehavior = ({
  search,
  queryParamsStringified = '',
  exportName,
}: DataCoordinatedInauthenticBehavior) => {
  const { data, error } = useSWR<GetSearchTweetContentsResponse>(
    `/api/searches/${encodeURIComponent(search)}/tweetContents${queryParamsStringified}`,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  if (error) {
    return (
      <Alert size="small" type="error">
        Error occured: {error.message}
      </Alert>
    );
  }

  if (!data) {
    return (
      <>
        <Alert size="small" type="info">
          Due to the big amount of data, this table may take some time to display. Please be
          patient.
        </Alert>
        <Loading />
      </>
    );
  }

  const tweetContents = data?.tweetContents || [];
  if (tweetContents.length === 0) {
    return (
      <Alert size="small" type="info">
        No similar tweets found.
      </Alert>
    );
  }

  return (
    <div className="fr-col">
      <TweetContentTable
        nbData={tweetContents.length}
        data={tweetContents}
        exportName={exportName}
      />
    </div>
  );
};

export default React.memo(DataCoordinatedInauthenticBehavior);
