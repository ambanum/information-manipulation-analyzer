export interface TweetContentTableProps {
  exportName: string;
  data: TweetContent[];
  nbData?: number;
  onFilter: (content: string) => any;
}

export interface TweetContent {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  content: string;
  count: number;
}
