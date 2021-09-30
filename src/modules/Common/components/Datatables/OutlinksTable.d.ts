export interface OutlinksTableProps {
  exportName: string;
  data: Outlink[];
  nbData?: number;
}

export interface Outlink  {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  url:string;
  count:number;
}