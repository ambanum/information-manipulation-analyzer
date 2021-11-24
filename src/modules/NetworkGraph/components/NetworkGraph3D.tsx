import React from 'react';
import classNames from 'classnames';
import ForceGraph3D from 'react-force-graph-3d';
import type { NetworkGraphJson } from './NetworkGraph.d';

type NetworkGraphReactTreeProps = {
  graph: NetworkGraphJson;
} & React.HTMLAttributes<HTMLDivElement>;

const NetworkGraphReactTree: React.FC<NetworkGraphReactTreeProps> = ({
  children,
  className,
  graph,
  ...props
}) => {
  return (
    <div className={classNames(className)} {...props}>
      <ForceGraph3D graphData={graph} linkDirectionalArrowLength={7} backgroundColor="green" />
    </div>
  );
};

export default NetworkGraphReactTree;
