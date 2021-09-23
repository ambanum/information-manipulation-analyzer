export interface BotScoreMetadataTableProps {
  exportName: string;
  data: BotScoreMetadata[];
  nbData?: number;
}

export interface BotScoreMetadata {
  [key: string]: any; // FIXME this is because typescript yells when it's not there
  title: string;
  description: string;
  value: number;
}
