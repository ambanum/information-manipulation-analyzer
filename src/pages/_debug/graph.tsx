import React from 'react';
import dynamic from 'next/dynamic';
const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
  ssr: false,
});
const NetworkGraph2D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph2D'), {
  ssr: false,
});
// const NetworkGraph3D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph3D'), {
//   ssr: false,
// });
import { NetworkGraphJson } from 'modules/NetworkGraph/components/NetworkGraph.d';
import { useToggle } from 'react-use';
import dayjs from 'dayjs';

import Gradient from 'javascript-color-gradient';
const colorGradient = new Gradient();
colorGradient.setGradient('#008000', '#e1000f'); // from red to green
colorGradient.setMidpoint(10); // set to 8 color steps

const hashtag = 'ok';
const file = 'test1.json';

// const path = String(process.env.NEXT_PUBLIC_BASE_PATH) + '/test1.json';
const path2 = String(process.env.NEXT_PUBLIC_BASE_PATH) + `/${file}`;

import json from '../../../public/test1.json';
const { nodes } = json;

const highlightNodesAndEdges = (
  data: NetworkGraphJson,
  { active, startDate, endDate }: { active?: boolean; startDate?: string; endDate?: string }
) => {
  if (!startDate && !endDate) {
    return data;
  }

  const newData = { ...data };
  const inactiveNodes: string[] = [];

  newData.nodes.map((node) => {
    const date = Array.isArray(node.metadata.date) ? node.metadata.date[0] : node.metadata.date;

    if (startDate && dayjs(date).isBefore(startDate)) {
      node.color = '#EEEEEEAA';
      inactiveNodes.push(node.id);
    } else if (endDate && dayjs(date).isAfter(endDate)) {
      node.color = '#EEEEEEAA';
      inactiveNodes.push(node.id);
    } else {
      // @ts-ignore
      node.color = node.botScore ? colorGradient.getColor(node.botScore) : '#FA0000AA';
    }
    if (active) {
      // @ts-ignore
      node.fx = node.x;
      // @ts-ignore
      node.fy = node.y;
    }

    return node;
  });

  newData.edges.map((edge: any) => {
    if (inactiveNodes.includes(edge.source) && inactiveNodes.includes(edge.target)) {
      edge.color = '#EEEEEEAA';
    } else {
      edge.color = '#CCCCCCF4';
    }
    return edge;
  });
  return newData;
};

const NetworkGraphDebugPage = () => {
  const startDate = nodes[0].metadata.date[0];

  const [tick, setTick] = React.useState<number>();
  const [active, toggleActive] = useToggle(false);

  React.useEffect(() => {
    let interval: NodeJS.Timer;

    if (active) {
      interval = setInterval(() => {
        setTick((currentTick) => {
          const newTick = currentTick !== undefined ? currentTick + 1 : 0;
          console.log(currentTick);
          console.log(newTick);

          if (newTick > nodes.length) {
            clearInterval(interval);
          }
          return newTick;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [active, nodes.length]);

  const onClickNode = (event: any) => {
    console.log(''); //eslint-disable-line
    console.log('╔════START══event══════════════════════════════════════════════════'); //eslint-disable-line
    console.log(hashtag); //eslint-disable-line
    console.log(event); //eslint-disable-line
    console.log('╚════END════event══════════════════════════════════════════════════'); //eslint-disable-line
  };

  const filteredNodes = highlightNodesAndEdges(json, {
    active,
    startDate,
    endDate: nodes[tick || nodes.length - 1].metadata.date[0],
  });

  const { nodes: newNodes, edges: newEdges } = filteredNodes;

  console.log(filteredNodes);
  return (
    <>
      <h2>
        Testing {path2}
        <br />
        <small style={{ fontSize: '0.5em' }}>
          Fr ({dayjs(nodes[0].metadata.date[0]).format()})<br />
          To ({dayjs(nodes[tick || nodes.length - 1].metadata.date[0]).format()})
        </small>
      </h2>
      <button onClick={() => setTick((tick || 0) - 1)} disabled={active || (tick || 0) === 0}>
        Before
      </button>{' '}
      <button onClick={toggleActive}>{active ? 'Pause' : 'Play'}</button>{' '}
      <button
        onClick={() => setTick((tick || 0) + 1)}
        disabled={active || (tick || 0) === nodes.length}
      >
        After
      </button>
      <div style={{ display: 'flex' }}>
        <div style={{ border: '1px solid red', flex: 1 }}>
          <h3>
            <a target="_blank" href="https://github.com/dunnock/react-sigma">
              react-sigma
            </a>
          </h3>
          <NetworkGraph
            // @ts-ignore
            graph={filteredNodes}
            onClickNode={onClickNode}
          />
        </div>
        {/* <div style={{ border: '1px solid blue', height: '400px' }}>
        <NetworkGraph
          url={path2}
          onClickNode={onClickNode}
          startDate={startDate}
          endDate={nodes[tick || nodes.length - 1].metadata.date[0]}
        />
      </div>
       */}
        <div
          style={{
            border: '1px solid blue',
            flex: 1,
            height: '100%',
            width: '80%',
            overflow: 'hidden',
          }}
        >
          <h3>
            <a target="_blank" href="https://github.vasturiano/react-force-graph">
              react-force-graph-2d
            </a>
          </h3>
          <NetworkGraph2D
            graph={{
              nodes: newNodes,
              // @ts-ignore
              links: newEdges,
            }}
          />
        </div>
        {/* <div style={{ border: '1px solid blue', height: '400px', width: '80%', overflow: 'hidden' }}>
        <NetworkGraph3D graph={{ nodes: newNodes, links: newEdges }} />
      </div> */}
      </div>
    </>
  );
};

export default NetworkGraphDebugPage;
