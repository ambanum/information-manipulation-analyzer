export type OnClickEvent = {
  data: {
    captor: {
      altKey: boolean;
      clientX: number;
      clientY: number;
      ctrlKey: boolean;
      isDragging: boolean;
      metaKey: boolean;
      shiftKey: boolean;
      x: number;
      y: number;
    };
  };
  node: {
    attributes: any;
    color: string;
    id: string;
    label: string;
    // read_cam0:size: 3.70801280154532
    // read_cam0:x: 169.18744145864454
    // read_cam0:y: -152.86684973916414
    // renderer1:size: 5.724605849251423
    // renderer1:x: 434.9790474445909
    // renderer1:y: 407.7819348002705
    size: number;
    x: number;
    y: number;
  };
  target: any;
};

export interface GraphNode {
  id: string;
  label: string;
  size: number;
  from: 'has RT' | 'original' | 'has quoted';
  x: number;
  y: number;
  community_id: number;
  metadata: {
    botscore: number;
    dates: string[];
    tweets: string[];
    quoted: string[];
    retweets: string[];
    dates_edges: string[];
  };
  // post computed
  color?: string;
  active?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  size: number;
  label: string;
  id: string;
  type: 'arrow';
  metadata: {
    dates: string[];
    quoted: string[];
    retweets: string[];
  };
  // post computed
  color?: string;
  active?: boolean;
}
export interface GraphMetadata {
  search: string;
  since: string;
  type_search: string;
  maxresults: number;
  minretweets: number;
  last_collected_tweet: number;
  community_algo?:
    | 'greedy_modularity'
    | 'asyn_lpa_communities'
    | 'girvan_newman'
    | 'label_propagation'
    | 'louvain';
  layout_algo?: 'circular' | 'kamada_kawai' | 'spring' | 'random' | 'spiral';
  last_collected_date: string;
  data_collection_date: string;
  most_recent_tweet: string;
}

export interface NetworkGraphJson {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
}

export type NetworkGraphProps = {
  path?: string;
  startDate?: string;
  endDate?: string;
  gexf?: string;
  url?: string;
  width?: string;
  height?: string;
  onClickNode?: (event: OnClickEvent) => any;
  onHoverEdge?: (event: any) => any;
  onHoverNode?: (event: any) => any;
} & React.HTMLAttributes<HTMLDivElement>;
