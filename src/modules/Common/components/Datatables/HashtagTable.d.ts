export interface HashtagTableProps {
  exportName: string;
  data: Hashtag[];
  nbData?: number;
  onHashtagClick: (username: string) => any;
  onHashtagSearchClick: (hashtag: string) => any;
}

export interface Hashtag {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  id: string;
  label: string;
  value: number;
  percentage?: number;
}
