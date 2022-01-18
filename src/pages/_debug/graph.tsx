import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { GetServerSideProps } from 'next';
import Gradient from 'javascript-color-gradient';
import { NetworkGraphJson } from 'modules/NetworkGraph/components/NetworkGraph.d';
// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import fs from 'fs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import path from 'path';
import sReactTabs from 'modules/Embassy/styles/react-tabs.module.css';
import { useToggle } from 'react-use';

const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
  ssr: false,
});
const NetworkGraph2D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph2D'), {
  ssr: false,
});
const NetworkGraph3D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph3D'), {
  ssr: false,
});

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const colorGradient = new Gradient();
colorGradient.setGradient('#008000', '#e1000f'); // from red to green
colorGradient.setMidpoint(0.5);

const hashtag = 'ok';

// const path = String(process.env.NEXT_PUBLIC_BASE_PATH) + '/#DébatLR.json';
// const path2 = String(process.env.NEXT_PUBLIC_BASE_PATH) + `/${file}`;

const highlightNodesAndEdges = (
  data: NetworkGraphJson,
  { active, startDate, endDate }: { active?: boolean; startDate?: string; endDate?: string }
) => {
  if (!startDate && !endDate) {
    return data;
  }
  const newData = { ...data };
  console.log(''); //eslint-disable-line
  console.log('╔════START════════════════════════════════════════════════════'); //eslint-disable-line
  console.log('highlightNodesAndEdges'); //eslint-disable-line
  console.log('edges', newData.edges.length); //eslint-disable-line
  console.time('edges');
  newData.edges.map((edge: any) => {
    const date = edge.metadata.dates[edge.metadata.dates.length - 1];

    if (
      (startDate && dayjs(date).isBefore(startDate)) ||
      (endDate && dayjs(date).isAfter(endDate))
    ) {
      edge.active = false;
      edge.color = '#00000003';
    } else {
      edge.active = true;
      edge.color = '#00000022';
    }

    edge.size = endDate ? edge.metadata.dates.length || 1 : edge.size;
    return edge;
  });
  console.timeEnd('edges');
  console.log('nodes', newData.nodes.length); //eslint-disable-line
  console.time('nodes');

  const nodeColors = [
    '#FFCA3A',
    '#FFBD00',
    '#FBC3BC',
    '#FF595E',
    '#FF0054',
    '#FF5400',
    '#9E0059',
    '#6A4C93',
    '#1982C4',
    '#2D7DD2',
    '#657ED4',
    '#390099',
    '#8AC926',
    '#97CC04',
    '#09BC8A',
    '#87BAAB',
    '#1282A2',
    '#508991',
    '#B8F2E6',
    '#AED9E0',
    '#0F7173',
    '#065143',
    '#C2B8B2',
    '#EDB183',
    '#D8A47F',
    '#81171B',
    '#540804',
    '#443627',
  ];

  newData.nodes.map((node) => {
    // const date = node.metadata.dates[node.metadata.dates.length - 1];

    // if (
    //   (startDate && dayjs(date).isBefore(startDate)) ||
    //   (endDate && dayjs(date).isAfter(endDate))
    // ) {
    //   node.active = false;
    //   node.color = '#EEEEEEAA';
    // } else {
    //   node.active = true;
    //   // @ts-ignore
    //   node.color = node?.metadata?.botscore
    //     ? colorGradient.getColor(node?.metadata?.botscore)
    //     : '#FA0000AA';
    //   console.log(`${node?.metadata?.botscore} %c${node.color}`, `color: ${node.color}`); //eslint-disable-line
    // }

    node.color = nodeColors[node?.community_id];

    node.size = endDate
      ? newData.edges
          .filter((edge) => edge.active && (edge.target?.id || edge.target) === node.id)
          .reduce((acc, val) => acc + val.size, 0)
      : node.size;

    if (active) {
      // @ts-ignore
      node.fx = node.x;
      // @ts-ignore
      node.fy = node.y;
      // @ts-ignore
      node.fz = node.z;
    }

    return node;
  });
  console.timeEnd('nodes');
  console.log('╚════END══════════════════════════════════════════════════════'); //eslint-disable-line

  return newData;
};

const NetworkgraphDetail = ({ name, json }) => {
  const [tick, setTick] = React.useState<number>();
  const [active, toggleActive] = useToggle(false);
  const { nodes, edges } = json;

  const dates = [
    ...nodes.reduce((acc, node) => [...acc, ...(node?.metadata?.dates || [])], []),
    ...edges.reduce((acc, edge) => [...acc, ...(edge?.metadata?.dates || [])], []),
  ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const startDate = dates[0];

  React.useEffect(() => {
    let interval: NodeJS.Timer;

    if (active) {
      interval = setInterval(() => {
        setTick((currentTick) => {
          const newTick = currentTick !== undefined ? currentTick + 1 : 0;

          if (newTick > dates.length) {
            clearInterval(interval);
          }
          return newTick;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [active, dates.length]);

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
    endDate: dates[tick],
  });

  const { nodes: newNodes, edges: newEdges } = filteredNodes;

  return (
    <>
      <div className="fr-mx-2w fr-my-2w">
        From <strong title={startDate}>{dayjs(startDate).format('llll')}</strong> to{' '}
        <strong title={dates[tick]}>{dayjs(dates[tick]).format('llll')}</strong>
      </div>
      <div className="fr-mx-2w fr-my-2w">
        <small>
          <strong>{tick || 0}</strong> / {dates.length} dates
        </small>{' '}
        <small>
          <strong>{nodes.length}</strong> nodes
        </small>{' '}
        <small>
          <strong>{edges.length}</strong> edges
        </small>
      </div>
      <div className="fr-mx-2w fr-my-2w text-right">
        <button
          className="fr-btn--sm fr-btn fr-fi-arrow-left-s-line-double fr-btn--icon-left"
          onClick={() => setTick((tick || 0) - 1)}
          disabled={active || (tick || 0) === 0}
        >
          Before
        </button>{' '}
        <button
          onClick={toggleActive}
          className={`fr-btn--sm fr-btn fr-fi-${active ? 'pause' : 'play'}-line fr-btn--icon-left`}
        >
          {active ? 'Pause' : 'Play'}
        </button>{' '}
        <button
          onClick={() => setTick((tick || 0) + 1)}
          disabled={active || (tick || 0) === nodes.length || !tick}
          className="fr-btn--sm fr-btn fr-fi-arrow-right-s-line-double fr-btn--icon-left"
        >
          After
        </button>{' '}
        <button
          onClick={() => {
            toggleActive(false);
            setTick(undefined);
          }}
          disabled={tick === 0 || !tick}
          className="fr-btn--sm fr-btn fr-fi-refresh-line fr-btn--icon-left"
        >
          Reset
        </button>
      </div>
      <Tabs
        selectedTabClassName={classNames(sReactTabs.selectedTab, 'react-tabs__tab--selected"')}
        selectedTabPanelClassName={classNames(
          sReactTabs.selectedTabPanel,
          'react-tabs__tab-panel--selected'
        )}
      >
        <div className="">
          <TabList
            className={classNames(
              'fr-grid-row fr-grid-row--gutters react-tabs__tab-list',
              sReactTabs.tabList
            )}
          >
            <Tab className={sReactTabs.tab}>ForceGraph3D</Tab>
            <Tab className={sReactTabs.tab}>Sigma</Tab>
            <Tab className={sReactTabs.tab}>ForceGraph2D</Tab>
          </TabList>
        </div>
        <div className="">
          <TabPanel>
            <h3>
              <a target="_blank" href="https://github.vasturiano/react-force-graph">
                react-force-graph-3d
              </a>
            </h3>
            <NetworkGraph3D graph={{ nodes: newNodes, links: newEdges }} />
          </TabPanel>
          <TabPanel>
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
          </TabPanel>

          <TabPanel>
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
          </TabPanel>
        </div>
      </Tabs>
    </>
  );
};

const NetworkGraphDebugPage = ({ files }: any) => {
  const [selectedFile, setSelectedFile] = React.useState(1);
  const file = files[selectedFile];

  const onChange = (event: any) => {
    setSelectedFile(event.target.value);
  };

  if (!files.length) {
    return <div>No files found</div>;
  }

  return (
    <>
      <h3 className="fr-mx-2w fr-my-2w">
        <select onChange={onChange}>
          {files.map((file: any, index: number) => (
            <option value={index} selected={index === selectedFile}>
              {file.name}
            </option>
          ))}
        </select>
      </h3>

      <NetworkgraphDetail {...file} />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const FOLDER = 'public/graph';
  const files = fs.readdirSync(path.join(FOLDER));

  const validFiles = [];
  for (const file of files.filter((file) => file.endsWith('.json'))) {
    try {
      const json = JSON.parse(fs.readFileSync(`${FOLDER}/${file}`));
      validFiles.push({
        name: file,
        path: path.join(FOLDER, file),
        json,
      });
    } catch (e) {
      console.error(e);
    }
  }

  return {
    props: {
      files: validFiles,
    },
  };
};
export default NetworkGraphDebugPage;
