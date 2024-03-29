export interface UsernameTableProps {
  exportName: string;
  data: Username[];
  nbData?: number;
  nbPerPage?: number;
  onUsernameClick: (username: string) => any;
  onUsernameViewClick: (username: string) => any;
  onUsernameSearchClick: (username: string) => any;
  onUsernameFilterClick: (username: string) => any;
}

export interface Username {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  id: string;
  label: string;
  value: number;
  percentage?: number;
  botScore?: number;
  creationDate?: number;
  followersCount?: number;
  verified?: boolean;
}
