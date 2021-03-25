export interface UsernameTableProps {
  exportName: string;
  data: Username[];
  onUsernameClick: (username: string) => any;
}

export interface Username {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  id: string;
  label: string;
  value: string;
}
