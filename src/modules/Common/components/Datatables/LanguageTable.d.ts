export interface LanguageTableProps {
  exportName: string;
  title?:string;
  subtitle?:string;
  data: Language[];
}

export interface Language {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  id: string;
  label: string;
  value: number;
  percentage?: number;
}
