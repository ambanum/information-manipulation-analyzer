import ForceGraph2D, { ForceGraphProps } from 'react-force-graph-2d';

import type { NetworkGraphJson } from './NetworkGraph.d';
// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useToggle } from 'react-use';

type NetworkGraphReact2DProps = {
  graph: NetworkGraphJson;
  onNodeClick: ForceGraphProps['onNodeClick'];
  onNodeHover: ForceGraphProps['onNodeHover'];
  onLinkHover: ForceGraphProps['onLinkHover'];
} & React.HTMLAttributes<HTMLDivElement>;

const NetworkGraphReact2D: React.FC<NetworkGraphReact2DProps> = ({
  children,
  className,
  graph,
  onNodeClick,
  onLinkHover,
  ...props
}) => {
  const fgRef = React.useRef();

  const [highlightNodes, setHighlightNodes] = React.useState(new Set());
  const [zoomed, toggleZoom] = useToggle(false);
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

  window.devicePixelRatio = 1; // force 1x pixel density

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

  // const paintRing = React.useCallback(
  //   (node, ctx) => {
  //     // add ring just for highlighted nodes
  //     ctx.beginPath();
  //     const radius = Math.sqrt(node.size);
  //     ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
  //     ctx.fillStyle =
  //       node === hoverNode ? node.color.substr(0, node.color.length - 2) + '00' : node.color;
  //     ctx.fill();

  //     ctx.beginPath();
  //     ctx.arc(node.x, node.y, 1, 0, 2 * Math.PI, false);
  //     // ctx.fillStyle = node.color.substr(0, node.color.length - 2);
  //     ctx.fillStyle = node.color;
  //     ctx.fill();
  //   },
  //   [hoverNode]
  // );

  const RATIO = 1000;
  const canvasWidth = document?.getElementById('forceGraph2DWrapper')?.clientWidth;

  return (
    <div className={classNames(className)} {...props} id="forceGraph2DWrapper">
      <ForceGraph2D
        ref={fgRef}
        width={canvasWidth}
        height={canvasWidth}
        graphData={{ nodes: graph.nodes, links: graph.edges }}
        backgroundColor="#1b1b35"
        nodeAutoColorBy="color"
        enableZoomInteraction={true}
        nodeVal={(node) => Math.sqrt(node.size)}
        nodeRelSize={1 / RATIO}
        nodeLabel={({ label, size }) => `${label} (RT ${size} time${size >= 2 ? 's' : ''})`}
        linkDirectionalArrowRelPos={0.5} /* if arrow is on the edge or in the middle */
        linkDirectionalArrowLength={2 / RATIO} /* Size of arrow */
        linkDirectionalArrowColor={() => '#abb8df'} /* Arrow color */
        linkAutoColorBy="color"
        // linkCurvature={0.25} /* curvature radius of the link line */
        linkLabel={({ label, size, source, target, ...rest }) => {
          return `${source?.label} ${label} ${target?.label} (${size} time${size >= 2 ? 's' : ''})`;
        }}
        maxZoom={1000 * RATIO}
        linkWidth={({ size }) => Math.sqrt(size)}
        enableNodeDrag={false} /* disable node drag */
        onNodeClick={onNodeClick}
        cooldownTicks={1} /* Need to be at least one for zoom to occur */
        // cooldownTime={
        //   60000
        // } /* Getter/setter for how long (ms) to render for before stopping and freezing the layout engine. */
        onLinkClick={handleLinkHover}
        onEngineStop={() => {
          if (!zoomed) {
            (fgRef?.current as any)?.zoomToFit(50, 100);
            toggleZoom(true);
          }
        }}
      />
    </div>
  );
};

export default NetworkGraphReact2D;
