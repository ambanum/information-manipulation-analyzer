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

export type NetworkGraphProps = {
  path?: string;
  gexf?: string;
  url?: string;
  width?: string;
  height?: string;
  onClickNode?: (event: OnClickEvent) => any;
} & React.HTMLAttributes<HTMLDivElement>;
