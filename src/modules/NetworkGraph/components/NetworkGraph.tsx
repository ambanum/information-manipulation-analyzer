import {
  EdgeShapes,
  ForceAtlas2,
  LoadJSON,
  NodeShapes,
  RandomizeNodePositions,
  RelativeSize,
  Sigma,
  SigmaEnableWebGL,
} from 'react-sigma';

import { NetworkGraphProps } from './NetworkGraph.d';
import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import s from './NetworkGraph.module.css';
import { useToggle } from 'react-use';

const Position = (props: any) => (
  <RandomizeNodePositions {...props}>
    <ForceAtlas2 iterationsPerRender={1} timeout={6000} />
    <RelativeSize initialSize={30} />
  </RandomizeNodePositions>
);
const NetworkGraph: React.FC<NetworkGraphProps> = ({
  children,
  className,
  path,
  url,
  width = '100%',
  height = '600px',
  onClickNode,
  ...props
}) => {
  const [graph, setGraph] = React.useState();
  const [loading, toggleLoading] = useToggle(!!url);

  React.useEffect(() => {
    if (!url) {
      return;
    }
    const fetchUrl = async () => {
      const { data } = await axios.get(url);
      console.log('fetchUrl', data);
      setGraph(data);
      toggleLoading(false);
    };
    fetchUrl();
  }, [url]);

  if (loading) {
    return null;
  }

  const position = graph ? (
    <Position />
  ) : (
    <LoadJSON path={path}>
      <Position />
    </LoadJSON>
  );

  return (
    <div className={classNames(s.wrapper, className)} {...props}>
      <Sigma
        renderer="webgl"
        graph={graph}
        style={{
          width,
          height,
          margin: '0 auto',
        }}
        onClickNode={onClickNode}
        settings={{
          defaultLabelSize: 16,
          font: 'MarianneBold',
          minEdgeSize: 0.5,
          maxEdgeSize: 1,
          minNodeSize: 1,
          maxNodeSize: 12,
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
