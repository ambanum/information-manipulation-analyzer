import ForceGraph2D, { ForceGraphMethods, ForceGraphProps } from 'react-force-graph-2d';

import type { NetworkGraphJson } from './NetworkGraph.d';
import React from 'react';
import classNames from 'classnames';
import { useToggle } from 'react-use';

type NetworkGraphReact2DProps = {
  graph: NetworkGraphJson;
  onNodeClick: ForceGraphProps['onNodeClick'];
  onLinkClick: ForceGraphProps['onLinkClick'];
  auto: boolean;
  width: number | undefined;
  height: number | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

const NetworkGraphReact2D: React.FC<NetworkGraphReact2DProps> = ({
  children,
  className,
  graph,
  auto = false,
  onNodeClick,
  onLinkClick,
  width,
  height,
  ...props
}) => {
  const fgRef = React.useRef<ForceGraphMethods>();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [show, toggleShow] = useToggle(true);

  // if it's needed, we need a comment
  // window.devicePixelRatio = 1; // force 1x pixel density

  React.useEffect(() => {
    toggleShow(false);
    setTimeout(() => toggleShow(true), 0);
  }, [auto, graph]);

  const sizeRange = graph.nodes.reduce(
    (acc, node) => ({
      min: Math.min(node.size, acc.min),
      max: Math.max(node.size, acc.max),
      sizes: { ...acc.sizes, [node.size]: (acc.sizes[node.size] || 0) + 1 },
    }),
    { min: Infinity, max: -1, sizes: {} as any }
  );

  const [highlightNodes, setHighlightNodes] = React.useState(new Set());
  const [zoomed, toggleZoom] = useToggle(false);
  const [highlightLinks, setHighlightLinks] = React.useState(new Set());

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleLinkClick = React.useCallback(
    (link, previousLink) => {
      highlightNodes.clear();
      highlightLinks.clear();

      if (link) {
        highlightLinks.add(link);
        highlightNodes.add(link.source);
        highlightNodes.add(link.target);
      }

      updateHighlight();
      if (onLinkClick && link) onLinkClick(link, previousLink);
    },
    [highlightNodes, highlightLinks, setHighlightNodes, setHighlightLinks]
  );

  const drawMenu = React.useCallback(
    (node, ctx, globalScale) => {
      const label = node.label;
      const fontSize = 2*(1+Math.log(node.size+1)) / globalScale;
      ctx.font = `${fontSize}px Arial`;

      // it shouold work with the below but we have a ratio problem on the x and y generated
      const textWidth = ctx.measureText(label).width;
      // // const textWidth = 40;
      const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2);
      let size = 4*(1+Math.log(node.size+1));
      if (sizeRange.max - sizeRange.min > 1000) {
        // use sqrt when difference between biggest node and smallest is too big
        size = Math.sqrt(node.size);
      }

      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.arc(node.fx, node.fy, size, 0, 2 * Math.PI, false);

      ctx.fillStyle = node.color;
      ctx.fill();

      if (node.size <= 1) {
        return;
      }
      ctx.globalAlpha = 1;
      ctx.fillText(label, node.fx, node.fy);
      ctx.fill();
    },
    [sizeRange]
  );

  const additionalProps = auto
    ? { cooldownTicks: 10000, cooldownTime: 10000 }
    : {
        cooldownTicks: 1,
        //  nodeCanvasObject: drawMenu,
        onEngineStop: () => {
          if (!zoomed) {
            fgRef?.current?.zoomToFit(50, 100);
            toggleZoom(true);
          }
        },
      };

  return (
    <div className={classNames(className)} {...props}>
      <ForceGraph2D
        ref={fgRef}
        // width={wrapperRef?.current?.clientWidth}
        // height={wrapperRef?.current?.clientHeight}
        width={width}
        height={height}
        graphData={show ? { nodes: graph.nodes, links: graph.edges } : { nodes: [], links: [] }}
        backgroundColor="#1e1e1e"
        nodeAutoColorBy="color"
        enableZoomInteraction={true}
        nodeVal={(node: any) => node.size}
        nodeLabel={({ label, size }: any) => `${label} (RT ${size} time${size >= 2 ? 's' : ''})`}
        /* so that if there is a retweet in both ways, we still see it correctly */
        linkDirectionalArrowRelPos={0.48}
        /* Diminish size of arrow every thousand node to keep readability */
        linkDirectionalArrowLength={Math.min(1, 5 - Math.floor(graph.nodes.length / 1000))}
        linkDirectionalArrowColor={() => '#abb8df'} /* Arrow color */
        linkAutoColorBy="color"
        // linkCurvature={0.25} /* curvature radius of the link line */
        linkLabel={({ label, size, source, target }: any) => {
          return `${source?.label} ${label} ${target?.label} (${size} time${size >= 2 ? 's' : ''})`;
        }}
        linkWidth={({ size }: any) => Math.sqrt(size)}
        enableNodeDrag={false} /* disable node drag */
        onNodeClick={onNodeClick}
        onLinkClick={handleLinkClick}
        // nodeCanvasObjectMode="after"
        {...additionalProps}
      />
    </div>
  );
};

export default NetworkGraphReact2D;
