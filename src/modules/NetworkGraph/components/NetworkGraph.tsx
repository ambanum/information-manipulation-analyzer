import {
  EdgeShapes,
  ForceAtlas2,
  LoadGEXF,
  LoadJSON,
  NodeShapes,
  RandomizeNodePositions,
  RelativeSize,
  Sigma,
  SigmaEnableWebGL,
} from 'react-sigma';
// import 'react-sigma/sigma/plugins/sigma.renderers.customShapes/shape-library.js';
// import 'react-sigma/sigma/plugins/sigma.renderers.customShapes/sigma.renderers.customShapes.js';

import dayjs from 'dayjs';
import Gradient from 'javascript-color-gradient';
const colorGradient = new Gradient();
colorGradient.setGradient('#008000', '#e1000f'); // from red to green
colorGradient.setMidpoint(10); // set to 8 color steps

import { NetworkGraphProps, NetworkGraphJson, GraphNode, GraphEdge } from './NetworkGraph.d';
import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import s from './NetworkGraph.module.css';
import { useToggle } from 'react-use';
import pick from 'lodash/fp/pick';

const Position = (props: any) => (
  <RandomizeNodePositions {...props}>
    <ForceAtlas2 iterationsPerRender={1} timeout={1000} />
    {/* <RelativeSize initialSize={30} /> */}
  </RandomizeNodePositions>
);

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  children,
  className,
  path,
  gexf,
  url,
  graph,
  startDate,
  endDate,
  width = '100%',
  height = '600px',
  onClickNode,
  ...props
}) => {
  const graphRef = React.useRef<typeof Sigma>();
  // const [graph, setGraph] = React.useState<NetworkGraphJson>(graphDefault);
  // const [loading, toggleLoading] = useToggle(!!url);

  // React.useEffect(() => {
  //   if (!url) {
  //     return;
  //   }
  //   const fetchUrl = async () => {
  //     const { data } = await axios.get<NetworkGraphJson>(url);
  //     setGraph(highlightNodesAndEdges(data, { startDate, endDate }));
  //     toggleLoading(false);
  //   };
  //   fetchUrl();
  // }, [url]);

  React.useEffect(() => {
    const { sigma } = graphRef?.current || {};
    if (!graph || !sigma) {
      return;
    }
    sigma.graph.nodes().forEach((n: GraphNode) => {
      var updated = graph.nodes.find((e) => e.id == n.id);
      Object.assign(n, pick(['color'])(updated));
    });
    sigma.graph.edges().forEach((n: GraphEdge) => {
      var updated = graph.edges.find((e) => e.id == n.id);
      Object.assign(n, pick(['color'])(updated));
    });

    sigma.refresh();
  }, [graph]);

  const position = graph ? (
    <Position />
  ) : path ? (
    <LoadJSON path={path}>
      <Position />
    </LoadJSON>
  ) : (
    <LoadGEXF path={gexf}>
      <Position />
    </LoadGEXF>
  );

  return (
    <div className={classNames(s.wrapper, className)} {...props}>
      <Sigma
        ref={graphRef}
        renderer="webgl"
        graph={graph}
        style={{
          width,
          height,
          margin: '0 auto',
        }}
        onClickNode={onClickNode}
        onHoverNode={(props) => {
          console.log(''); //eslint-disable-line
          console.log('╔════START══props══════════════════════════════════════════════════'); //eslint-disable-line
          console.log(props); //eslint-disable-line
          console.log('╚════END════props══════════════════════════════════════════════════'); //eslint-disable-line
        }}
        onHoverEdge={(props) => {
          console.log(''); //eslint-disable-line
          console.log('╔════START══props══════════════════════════════════════════════════'); //eslint-disable-line
          console.log(props); //eslint-disable-line
          console.log('╚════END════props══════════════════════════════════════════════════'); //eslint-disable-line
        }}
        settings={
          {
            // // Performance
            // hideEdgesOnMove: false,
            // hideLabelsOnMove: false,
            // renderLabels: true,
            // renderEdgeLabels: true,
            // // Component rendering
            // defaultNodeColor: '#999',
            // defaultNodeType: 'circle',
            // defaultEdgeColor: '#ccc',
            // defaultEdgeType: 'line',
            // labelFont: 'MarianneBold',
            // labelSize: 16,
            // labelWeight: 'normal',
            // edgeLabelFont: 'Arial',
            // edgeLabelSize: 14,
            // edgeLabelWeight: 'normal',
            // stagePadding: 30,
            // // Labels
            // labelDensity: 0.07,
            // labelGridCellSize: 60,
            // labelRenderedSizeThreshold: 6,
            // drawEdges: true,
            // renderEdgeLabels: true,
            // defaultLabelSize: 16,
            // font: 'MarianneBold',
            // // minEdgeSize: 0.5,
            // // maxEdgeSize: 1,
            // // minNodeSize: 1,
            // // maxNodeSize: 12,
            // animationsTime: 100,
          }
        }
      >
        <EdgeShapes default="curvedArrow" />
        <NodeShapes default="star" />
        {position}
      </Sigma>
    </div>
  );
};

export default NetworkGraph;
