// @ts-nocheck
import React from 'react';
import dynamic from 'next/dynamic';
const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
  ssr: false,
});
const NetworkGraph2D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph2D'), {
  ssr: false,
});
const NetworkGraph3D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph3D'), {
  ssr: false,
});
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import sReactTabs from 'modules/Embassy/styles/react-tabs.module.css';
import { NetworkGraphJson } from 'modules/NetworkGraph/components/NetworkGraph.d';
import { useToggle } from 'react-use';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import classNames from 'classnames';
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import Gradient from 'javascript-color-gradient';
const colorGradient = new Gradient();
colorGradient.setGradient('#008000', '#e1000f'); // from red to green
colorGradient.setMidpoint(10); // set to 8 color steps

const hashtag = 'ok';
const file = '#DébatLR.json';

// const path = String(process.env.NEXT_PUBLIC_BASE_PATH) + '/#DébatLR.json';
// const path2 = String(process.env.NEXT_PUBLIC_BASE_PATH) + `/${file}`;

import json from '../../../public/#DébatLR.json';
import { log } from 'console';
const { nodes, edges } = json;

const dates = [
  ...nodes.reduce((acc, node) => [...acc, ...(node?.metadata?.date || [])], []),
  ...edges.reduce((acc, edge) => [...acc, ...(edge?.metadata?.date || [])], []),
].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

const highlightNodesAndEdges = (
  data: NetworkGraphJson,
  { active, startDate, endDate }: { active?: boolean; startDate?: string; endDate?: string }
) => {
  if (!startDate && !endDate) {
    return data;
  }

  const newData = { ...data };

  const getLastDateIndex = (dates: string[]) => {
    return dates.reduce((acc: number, date2: string, index) => {
      if (
        startDate &&
        dayjs(startDate).isBefore(date2) &&
        endDate &&
        dayjs(endDate).isAfter(date2)
      ) {
        return index;
      }
      return acc;
    }, 0);
  };

  newData.edges.map((edge: any) => {
    const lastDateIndex = getLastDateIndex(edge.metadata.date);
    const date = edge.metadata.date[lastDateIndex];

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

    edge.size = endDate ? lastDateIndex || 1 : edge.size;
    return edge;
  });

  newData.nodes.map((node) => {
    const lastDateIndex = getLastDateIndex(node.metadata.date);
    const date = node.metadata.date[lastDateIndex];

    if (
      (startDate && dayjs(date).isBefore(startDate)) ||
      (endDate && dayjs(date).isAfter(endDate))
    ) {
      node.active = false;
      node.color = '#EEEEEEAA';
    } else {
      node.active = true;
      // @ts-ignore
      node.color = node.botScore ? colorGradient.getColor(node.botScore) : '#FA0000AA';
    }

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

  return newData;
};

const NetworkGraphDebugPage = () => {
  const startDate = dates[0];

  const [tick, setTick] = React.useState<number>();
  const [active, toggleActive] = useToggle(false);

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
      <h3 className="fr-mx-2w fr-my-2w">
        Testing {file}
        <br />
      </h3>
      <div className="fr-mx-2w fr-my-2w">
        From <strong>{dayjs(startDate).format('llll')}</strong> to{' '}
        <strong>{dayjs(dates[tick]).format('llll')}</strong>
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
            <Tab className={sReactTabs.tab}>Sigma</Tab>
            <Tab className={sReactTabs.tab}>ForceGraph2D</Tab>
            <Tab className={sReactTabs.tab}>ForceGraph3D</Tab>
          </TabList>
        </div>
        <div className="">
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
          <TabPanel>
            <h3>
              <a target="_blank" href="https://github.vasturiano/react-force-graph">
                react-force-graph-3d
              </a>
            </h3>
            <NetworkGraph3D graph={{ nodes: newNodes, links: newEdges }} />
          </TabPanel>
        </div>
      </Tabs>
    </>
  );
};

export default NetworkGraphDebugPage;
