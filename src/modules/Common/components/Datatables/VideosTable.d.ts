export interface VideosTableProps {
  exportName: string;
  data: Video[];
  nbData?: number;
}

export interface Video extends TweetMedia {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  count:number;
}