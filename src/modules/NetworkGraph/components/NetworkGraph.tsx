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
    <RelativeSize initialSize={30} />
  </RandomizeNodePositions>
);

const highlightNodesAndEdges = (
  data: NetworkGraphJson,
  { startDate, endDate }: { startDate?: string; endDate?: string }
) => {
  if (!startDate && !endDate) {
    return data;
  }

  const newData = { ...data };
  const inactiveNodes: string[] = [];

  newData.nodes.map((node) => {
    if (startDate && dayjs(node.date).isBefore(startDate)) {
      node.color = 'rgb(240,240,240)';
      inactiveNodes.push(node.id);
    } else if (endDate && dayjs(node.date).isAfter(endDate)) {
      node.color = 'rgb(240,240,240)';
      inactiveNodes.push(node.id);
    } else {
      node.color = node.botScore ? colorGradient.getColor(node.botScore) : 'rgb(255,200,100)';
    }
    return node;
  });

  newData.edges.map((edge) => {
    if (inactiveNodes.includes(edge.source) && inactiveNodes.includes(edge.target)) {
      edge.color = 'rgb(240,240,240)';
    } else {
      edge.color = 'rgb(0,0,0)';
    }
    return edge;
  });
  return newData;
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  children,
  className,
  path,
  gexf,
  url,
  startDate,
  endDate,
  width = '100%',
  height = '600px',
  onClickNode,
  ...props
}) => {
  const graphRef = React.useRef<typeof Sigma>();
  const [graph, setGraph] = React.useState<NetworkGraphJson>();
  const [loading, toggleLoading] = useToggle(!!url);

  React.useEffect(() => {
    if (!url) {
      return;
    }
    const fetchUrl = async () => {
      const { data } = await axios.get<NetworkGraphJson>(url);
      setGraph(highlightNodesAndEdges(data, { startDate, endDate }));
      toggleLoading(false);
    };
    fetchUrl();
  }, [url]);

  React.useEffect(() => {
    const { sigma } = graphRef?.current || {};
    if (!graph || !sigma) {
      return;
    }
    const newgraph = highlightNodesAndEdges(graph, { startDate, endDate });
    sigma.graph.nodes().forEach((n: GraphNode) => {
      var updated = newgraph.nodes.find((e) => e.id == n.id);
      Object.assign(n, pick(['color'])(updated));
    });
    sigma.graph.edges().forEach((n: GraphEdge) => {
      var updated = newgraph.edges.find((e) => e.id == n.id);
      Object.assign(n, pick(['color'])(updated));
    });
    sigma.refresh();
  }, [startDate, endDate]);

  if (loading) {
    return null;
  }

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
        settings={{
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

          drawEdges: true,
          renderEdgeLabels: true,
          defaultLabelSize: 16,
          font: 'MarianneBold',
          // minEdgeSize: 0.5,
          // maxEdgeSize: 1,
          // minNodeSize: 1,
          // maxNodeSize: 12,
          animationsTime: 100,
        }}
      >
        <EdgeShapes default="curvedArrow" />
        <NodeShapes default="star" />
        {position}
      </Sigma>
    </div>
  );
};

export default NetworkGraph;
