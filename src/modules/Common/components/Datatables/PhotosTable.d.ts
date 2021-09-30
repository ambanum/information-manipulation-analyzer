export interface PhotosTableProps {
  exportName: string;
  data: Photo[];
  nbData?: number;
}

export interface Photo extends TweetMedia {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  count:number;
}