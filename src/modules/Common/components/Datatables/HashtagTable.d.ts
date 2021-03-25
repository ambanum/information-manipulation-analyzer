export interface HashtagTableProps {
  data: Hashtag[];
  onHashtagClick: (username: string) => any;
}

export interface Hashtag {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  id: string;
  label: string;
  value: string;
}
