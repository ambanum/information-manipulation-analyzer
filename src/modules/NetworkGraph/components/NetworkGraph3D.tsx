// @ts-nocheck
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
  const [highlightNodes, setHighlightNodes] = React.useState(new Set());
  const [highlightLinks, setHighlightLinks] = React.useState(new Set());
  const [hoverNode, setHoverNode] = React.useState(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      if (node.neighbors) {
        node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
      }
      if (node.links) {
        node.links.forEach((link) => highlightLinks.add(link));
      }
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const onNodeHover = (node) => {
    if (!node) {
      return;
    }
    console.log(''); //eslint-disable-line
    console.log('╔════START══node══════════════════════════════════════════════════'); //eslint-disable-line
    console.log(node); //eslint-disable-line
    console.log('╚════END════node══════════════════════════════════════════════════'); //eslint-disable-line
  };

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  return (
    <div className={classNames(className)} {...props}>
      <ForceGraph3D
        graphData={graph}
        linkDirectionalArrowLength={7}
        backgroundColor="#333"
        nodeAutoColorBy="color"
        nodeVal={(node) => node.size}
        nodeLabel={({ label, size }) => `${label} (${size} time${size >= 2 ? 's' : ''})`}
        linkDirectionalArrowRelPos={0.5} /* if arrow is on the edge or in the middle */
        linkDirectionalArrowLength={5} /* Size of arrow */
        linkDirectionalParticles={({ size }) => size}
        linkDirectionalParticleColor="black"
        linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 2 : 0)}
        linkAutoColorBy="color"
        linkLabel={({ label, size }) => `${label} (${size} time${size >= 2 ? 's' : ''})`}
        linkWidth={({ size }) => Math.sqrt(size)}
        onNodeHover={onNodeHover}
        onLinkHover={handleLinkHover}
      />
    </div>
  );
};

export default NetworkGraphReactTree;
