import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

// import Gradient from 'javascript-color-gradient';
import { NetworkGraphJson } from 'modules/NetworkGraph/components/NetworkGraph.d';
import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import sReactTabs from 'modules/Embassy/styles/react-tabs.module.css';
import { useToggle } from 'react-use';
import NodeDetail from './NodeDetail';
import EdgeDetail from './EdgeDetail';
import s from './GraphDetail.module.css';

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

// for bot score color
// const colorGradient = new Gradient();
// colorGradient.setGradient('#008000', '#e1000f'); // from red to green
// colorGradient.setMidpoint(0.5);

const highlightNodesAndEdges = (
  data: NetworkGraphJson,
  colors: string[],
  { active, startDate, endDate }: { active?: boolean; startDate?: string; endDate?: string }
) => {
  if (!startDate && !endDate) {
    return data;
  }
  const newData = { ...data };

  newData.edges.map((edge: any) => {
    const date = edge.metadata.dates[edge.metadata.dates.length - 1];

    if (
      (startDate && dayjs(date).isBefore(startDate)) ||
      (endDate && dayjs(date).isAfter(endDate))
    ) {
      edge.active = false;
      edge.color = '#999999';
    } else {
      edge.active = true;
      edge.color = '#f8f8f8';
    }

    edge.size = endDate ? edge.metadata.dates.length || 1 : edge.size;
    return edge;
  });

  newData.nodes.map((node) => {
    const date = node.metadata.dates[node.metadata.dates.length - 1];

    if (
      (startDate && dayjs(date).isBefore(startDate)) ||
      (endDate && dayjs(date).isAfter(endDate))
    ) {
      node.active = false;
      node.color = '#1b1b35AA';
    } else {
      node.active = true;
      // @ts-ignore
      // node.color = node?.metadata?.botscore
      //   ? colorGradient.getColor(node?.metadata?.botscore)
      //   : '#FA0000AA';
      // for debug
      // console.log(`${node?.metadata?.botscore} %c${node.color}`, `color: ${node.color}`); //eslint-disable-line
      node.color = colors[node?.community_id || 0];
    }

    node.size = endDate
      ? newData.edges
          .filter((edge) => edge.active && ((edge.target as any)?.id || edge.target) === node.id)
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

interface GraphDetailProps {
  name: string;
  json: NetworkGraphJson;
  colors: string[];
}

const GraphDetail: React.FC<GraphDetailProps> = ({ name, json, colors }) => {
  const [info, setInfo] = React.useState<React.ReactNode>();
  const [tick, setTick] = React.useState<number | undefined>();
  const [tickInterval, setTickInterval] = React.useState<number>(200);
  const [active, toggleActive] = useToggle(false);
  const { nodes, edges } = json;

  const dates = [
    ...nodes.reduce((acc: string[], node) => [...acc, ...(node?.metadata?.dates || [])], []),
    ...edges.reduce((acc: string[], edge) => [...acc, ...(edge?.metadata?.dates || [])], []),
  ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const startDate = dates[0];
  const endDate = dates[tick || dates.length - 1];

  React.useEffect(() => {
    setTick(0);
    toggleActive(false);
  }, [name]);

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
      }, tickInterval);
    }
    return () => clearInterval(interval);
  }, [active, dates.length]);

  const onClickNode = (event: any) => {
    console.log(''); //eslint-disable-line
    console.log('╔════START═onClickNode══════════════════════════════════════════════'); //eslint-disable-line
    console.log(event); //eslint-disable-line
    console.log('╚════END═══onClickNode══════════════════════════════════════════════'); //eslint-disable-line
  };

  const onNodeHover = React.useCallback(
    (node: any) => {
      toggleActive(true);
      setInfo(
        <div>
          Node<pre>{JSON.stringify(node, null, 2)}</pre>
        </div>
      );
      toggleActive(false);
    },
    [setInfo]
  );
  const onEdgeHover = React.useCallback(
    (edge: any) => {
      toggleActive(true);
      setInfo(
        <div>
          Edge<pre>{JSON.stringify(edge, null, 2)}</pre>
        </div>
      );
      toggleActive(false);
    },
    [setInfo]
  );

  const filteredNodes = highlightNodesAndEdges(json, colors, {
    active,
    startDate,
    endDate,
  });

  const infoCard = info ? (
    <div className={s.infoCard}>
      <button onClick={() => setInfo(undefined)}>Close</button>
      {info}
    </div>
  ) : null;

  return (
    <div className={s.wrapper}>
      <div className="fr-mx-2w fr-my-2w">
        From <strong title={startDate}>{dayjs(startDate).format('llll')}</strong> to{' '}
        <strong title={endDate}>{dayjs(endDate).format('llll')}</strong>
      </div>
      <div className="fr-mx-2w fr-my-2w text-right">
        <span className="fr-mx-2w fr-my-2w">
          <small>
            <strong>{tick || 0}</strong> / {dates.length} dates
          </small>{' '}
          <small>
            <strong>{nodes.length}</strong> nodes
          </small>{' '}
          <small>
            <strong>{edges.length}</strong> edges
          </small>
        </span>
        <input
          onChange={(event) => setTickInterval(+event.target.value)}
          value={tickInterval}
          disabled={active}
          size={4}
        />
        ms{' '}
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
        <div>
          <TabPanel>
            <h3>
              <a target="_blank" href="https://github.vasturiano/react-force-graph">
                react-force-graph-3d
              </a>
            </h3>
            <div className={s.graphWrapper}>
              {infoCard}
              <NetworkGraph3D
                graph={filteredNodes}
                onNodeHover={onNodeHover}
                onLinkHover={onEdgeHover}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <h3>
              <a target="_blank" href="https://github.com/dunnock/react-sigma">
                react-sigma
              </a>
            </h3>
            <div className={s.graphWrapper}>
              {infoCard}
              <NetworkGraph
                // @ts-ignore
                graph={filteredNodes}
                onClickNode={onClickNode}
              />
            </div>
          </TabPanel>

          <TabPanel>
            <h3>
              <a target="_blank" href="https://github.vasturiano/react-force-graph">
                react-force-graph-2d
              </a>
            </h3>
            <div className={s.graphWrapper}>
              {infoCard}
              <NetworkGraph2D
                graph={filteredNodes}
                onNodeHover={onNodeHover}
                onLinkHover={onEdgeHover}
              />
            </div>
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

export default GraphDetail;
