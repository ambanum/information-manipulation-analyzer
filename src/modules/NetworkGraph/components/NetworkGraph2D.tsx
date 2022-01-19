import ForceGraph2D, { ForceGraphProps } from 'react-force-graph-2d';

import type { NetworkGraphJson } from './NetworkGraph.d';
// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

type NetworkGraphReact2DProps = {
  graph: NetworkGraphJson;
  onNodeHover: ForceGraphProps['onNodeHover'];
  onLinkHover: ForceGraphProps['onLinkHover'];
} & React.HTMLAttributes<HTMLDivElement>;

const NetworkGraphReact2D: React.FC<NetworkGraphReact2DProps> = ({
  children,
  className,
  graph,
  onNodeHover,
  onLinkHover,
  ...props
}) => {
  const fgRef = React.useRef();

  const [highlightNodes, setHighlightNodes] = React.useState(new Set());
  const [highlightLinks, setHighlightLinks] = React.useState(new Set());
  const [hoverNode, setHoverNode] = React.useState(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };
  const handleNodeHover: ForceGraphProps['onNodeHover'] = (node, ...rest) => {
    if (!node) {
      return;
    }
    if (onNodeHover) onNodeHover(node, ...rest);
  };

  // const handleNodeHover = (node) => {
  //   highlightNodes.clear();
  //   highlightLinks.clear();
  //   if (node) {
  //     highlightNodes.add(node);
  //     if (node.neighbors) {
  //       node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
  //     }
  //     if (node.links) {
  //       node.links.forEach((link) => highlightLinks.add(link));
  //     }
  //   }

  //   setHoverNode(node || null);
  //   updateHighlight();
  // };
  const handleLinkHover = React.useCallback(
    (link, previousLink) => {
      highlightNodes.clear();
      highlightLinks.clear();

      if (link) {
        highlightLinks.add(link);
        highlightNodes.add(link.source);
        highlightNodes.add(link.target);
      }

      updateHighlight();
      if (onLinkHover && link) onLinkHover(link, previousLink);
    },
    [highlightNodes, highlightLinks, setHighlightNodes, setHighlightLinks]
  );

  const paintRing = React.useCallback(
    (node, ctx) => {
      // add ring just for highlighted nodes
      ctx.beginPath();
      const radius = Math.sqrt(node.size);
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle =
        node === hoverNode ? node.color.substr(0, node.color.length - 2) + '00' : node.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, 1, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.color.substr(0, node.color.length - 2);
      ctx.fill();
    },
    [hoverNode]
  );

  return (
    <div className={classNames(className)} {...props}>
      <ForceGraph2D
        ref={fgRef}
        backgroundColor="#1b1b35"
        graphData={{ nodes: graph.nodes, links: graph.edges }}
        nodeLabel={({ label, size }) => `${label} (${size} time${size >= 2 ? 's' : ''})`}
        linkCurvature={0} /* curve edges */
        nodeAutoColorBy="color" /* give color to node */
        linkDirectionalArrowRelPos={0.5} /* if arrow is on the edge or in the middle */
        linkDirectionalArrowLength={5} /* Size of arrow */
        /* Edges */
        /* animating edges
        linkDirectionalParticles="size"
        linkDirectionalParticleSpeed={(d) => d.size * 0.001}
        */
        linkColor={({ color }) => `${color}1A`}
        linkLabel={({ label, size }) => `${label} (${size} time${size >= 2 ? 's' : ''})`}
        linkWidth={({ size }) => Math.sqrt(size)}
        /* Curved lines and self links (source) */
        /* https://github.com/vasturiano/react-force-graph */
        /* linkCurvature="curvature"
        linkCurveRotation="rotation"
        linkDirectionalParticles={0.001}*/

        /* Highlight nodes/links (source) */
        /* https://github.com/vasturiano/react-force-graph */
        linkDirectionalParticles={({ size }) => size}
        linkDirectionalParticleColor="black"
        linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 2 : 0)}
        // nodeCanvasObjectMode={(node) => (highlightNodes.has(node) ? 'before' : undefined)}
        nodeCanvasObject={paintRing}
        // onNodeHover={handleNodeHover}
        // onLinkHover={handleLinkHover}
        onNodeClick={handleNodeHover}
        onLinkClick={handleLinkHover}
        /* Fit graph to canvas (source) */
        /* https://github.com/vasturiano/react-force-graph */
        /* */
        // cooldownTicks={50}
        // onEngineStop={() => fgRef.current.zoomToFit(400)}

        /* Node collision detection (source) */
        /* https://github.com/vasturiano/react-force-graph */
        // d3AlphaDecay={10}
        // d3VelocityDecay={10}
      />
    </div>
  );
};

export default NetworkGraphReact2D;
