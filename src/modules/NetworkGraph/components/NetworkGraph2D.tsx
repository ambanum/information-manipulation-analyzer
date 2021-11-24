import React from 'react';
import classNames from 'classnames';
import ForceGraph2D from 'react-force-graph-2d';
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
  console.log(''); //eslint-disable-line
  console.log('╔════START══graph══════════════════════════════════════════════════'); //eslint-disable-line
  console.log(graph); //eslint-disable-line
  console.log('╚════END════graph══════════════════════════════════════════════════'); //eslint-disable-line

  return (
    <div className={classNames(className)} {...props}>
      NetworkGraph2D
      {children}
      <ForceGraph2D graphData={graph} backgroundColor="aliceblue" />
    </div>
  );
};

export default NetworkGraphReactTree;
