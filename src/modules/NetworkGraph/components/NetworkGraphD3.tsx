import ForceGraph2D, { ForceGraphProps } from 'react-force-graph-2d';

import type { NetworkGraphJson } from './NetworkGraph.d';
// @ts-nocheck
import React from 'react';
import { Graph } from 'react-d3-graph';
import classNames from 'classnames';

type NetworkGraphD3Props = {
  graph: NetworkGraphJson;
  onNodeClick: ForceGraphProps['onNodeClick'];
  onNodeHover: ForceGraphProps['onNodeHover'];
  onLinkHover: ForceGraphProps['onLinkHover'];
} & React.HTMLAttributes<HTMLDivElement>;

const NetworkGraphD3: React.FC<NetworkGraphD3Props> = ({
  children,
  className,
  graph,
  onNodeClick,
  ...props
}) => {
  // the graph configuration, just override the ones you need
  const myConfig = {
    directed: true,
    freezeAllDragEvents: true,
    panAndZoom: true,
    d3: {
      disableLinkForce: true,
    },
    // nodeHighlightBehavior: true,
    // node: {
    //   color: 'lightgreen',
    //   size: 120,
    //   highlightStrokeColor: 'blue',
    // },
    // link: {
    //   highlightColor: 'lightblue',
    // },
  };

  const onClickNode = function (nodeId) {
    window.alert(`Clicked node ${nodeId}`);
  };

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };
  console.log(''); //eslint-disable-line
  console.log('╔════START════════════════════════════════════════════════════'); //eslint-disable-line
  console.log({ nodes: graph.nodes, links: graph.edges }); //eslint-disable-line
  console.log('╚════END══════════════════════════════════════════════════════'); //eslint-disable-line

  return (
    <Graph
      id="graph-id" // id is mandatory
      data={{
        nodes: graph.nodes,
        links: graph.edges.map((edge) => ({
          ...edge,
          source: edge.source?.id || edge.source,
          target: edge.target?.id || edge.target,
        })),
      }}
      config={myConfig}
      onClickNode={onClickNode}
      onClickLink={onClickLink}
    />
  );
};

// type NetworkGraphReact2DProps = {
//   graph: NetworkGraphJson;
//   onNodeClick: ForceGraphProps['onNodeClick'];
//   onNodeHover: ForceGraphProps['onNodeHover'];
//   onLinkHover: ForceGraphProps['onLinkHover'];
// } & React.HTMLAttributes<HTMLDivElement>;

// const NetworkGraphReact2D: React.FC<NetworkGraphReact2DProps> = ({
//   children,
//   className,
//   graph,
//   onNodeClick,
//   ...props
// }) => {
//   const fgRef = React.useRef();

//   const [highlightNodes, setHighlightNodes] = React.useState(new Set());
//   const [highlightLinks, setHighlightLinks] = React.useState(new Set());
//   const [hoverNode, setHoverNode] = React.useState(null);

//   const updateHighlight = () => {
//     setHighlightNodes(highlightNodes);
//     setHighlightLinks(highlightLinks);
//   };

//   const handleNodeHover: ForceGraphProps['onNodeHover'] = (node, ...rest) => {
//     if (!node) {
//       return;
//     }
//     if (onNodeHover) onNodeHover(node, ...rest);
//   };

//   window.devicePixelRatio = 1; // force 1x pixel density

//   // const handleNodeHover = (node) => {
//   //   highlightNodes.clear();
//   //   highlightLinks.clear();
//   //   if (node) {
//   //     highlightNodes.add(node);
//   //     if (node.neighbors) {
//   //       node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
//   //     }
//   //     if (node.links) {
//   //       node.links.forEach((link) => highlightLinks.add(link));
//   //     }
//   //   }

//   //   setHoverNode(node || null);
//   //   updateHighlight();
//   // };

//   // const handleLinkHover = React.useCallback(
//   //   (link, previousLink) => {
//   //     highlightNodes.clear();
//   //     highlightLinks.clear();

//   //     if (link) {
//   //       highlightLinks.add(link);
//   //       highlightNodes.add(link.source);
//   //       highlightNodes.add(link.target);
//   //     }

//   //     updateHighlight();
//   //     if (onLinkHover && link) onLinkHover(link, previousLink);
//   //   },
//   //   [highlightNodes, highlightLinks, setHighlightNodes, setHighlightLinks]
//   // );

//   // const paintRing = React.useCallback(
//   //   (node, ctx) => {
//   //     // add ring just for highlighted nodes
//   //     ctx.beginPath();
//   //     const radius = Math.sqrt(node.size);
//   //     ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
//   //     ctx.fillStyle =
//   //       node === hoverNode ? node.color.substr(0, node.color.length - 2) + '00' : node.color;
//   //     ctx.fill();

//   //     ctx.beginPath();
//   //     ctx.arc(node.x, node.y, 1, 0, 2 * Math.PI, false);
//   //     // ctx.fillStyle = node.color.substr(0, node.color.length - 2);
//   //     ctx.fillStyle = node.color;
//   //     ctx.fill();
//   //   },
//   //   [hoverNode]
//   // );

//   return (
//     <div className={classNames(className)} {...props}>
//       <ForceGraph2D
//         ref={fgRef}
//         graphData={{ nodes: graph.nodes, links: graph.edges }}
//         backgroundColor="#1b1b35"
//         nodeAutoColorBy="color"
//         nodeVal={(node) => node.size}
//         nodeRelSize={2}
//         nodeLabel={({ label, size }) => `${label} (${size} time${size >= 2 ? 's' : ''})`}
//         linkDirectionalArrowRelPos={0.5} /* if arrow is on the edge or in the middle */
//         linkDirectionalArrowLength={6} /* Size of arrow */
//         linkDirectionalArrowColor={() => '#abb8df'} /* Arrow color */
//         linkColor={() => '#41548e'}
//         linkCurvature={0.25} /* curvature radius of the link line */
//         linkLabel={({ label, size, source, target, ...rest }) => {
//           return `${source?.label} ${label} ${target?.label} (${size} time${size >= 2 ? 's' : ''})`;
//         }}
//         linkWidth={({ size }) => Math.sqrt(size)}
//         enableNodeDrag={false} /* disable node drag */
//         onNodeClick={onNodeClick}
//         cooldownTime={
//           60000
//         } /* Getter/setter for how long (ms) to render for before stopping and freezing the layout engine. */
//         // onLinkClick={handleLinkHover}
//       />
//     </div>
//   );
// };

export default NetworkGraphD3;
