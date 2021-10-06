import * as React from 'react';

import Alert from '../components/Alert/Alert';
import { GetSearchPhotosResponse } from '../interfaces';
import Loading from 'components/Loading';
import PhotosTable from '../components/Datatables/PhotosTable';
import { PhotosTableProps } from '../components/Datatables/PhotosTable.d';
import useSWR from 'swr';

interface DataPhotos {
  search: string;
  queryParamsStringified?: string;
  exportName: PhotosTableProps['exportName'];
}

const DataPhotos = ({ search, queryParamsStringified = '', exportName }: DataPhotos) => {
  const { data } = useSWR<GetSearchPhotosResponse>(
    `/api/searches/${encodeURIComponent(search)}/photos${queryParamsStringified}`,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  if (!data) {
    return <Loading />;
  }

  const photos = data?.photos || [];
  if (photos.length === 0) {
    return (
      <Alert size="small" type="info">
        No photos found.
      </Alert>
    );
  }

  return (
    <div className="fr-col fr-mt-8w">
      <PhotosTable nbData={photos.length} data={photos} exportName={exportName} />
    </div>
  );
};

export default React.memo(DataPhotos);
