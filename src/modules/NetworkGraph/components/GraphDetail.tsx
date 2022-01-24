import { Button, ButtonGroup, Col, Container, Row, Select } from '@dataesr/react-dsfr';
import { Modal, ModalClose, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { Tab, Tabs } from '@dataesr/react-dsfr';

import EdgeDetail from './EdgeDetail';
import Gradient from 'javascript-color-gradient';
import { NetworkGraphJson } from 'modules/NetworkGraph/components/NetworkGraph.d';
import NodeDetail from './NodeDetail';
import React from 'react';
import { TextInput } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import s from './GraphDetail.module.css';
import { useState } from 'react';
import { useToggle } from 'react-use';
import useUrl from 'hooks/useUrl';

const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
  ssr: false,
});
const NetworkGraph2D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph2D'), {
  ssr: false,
});
const NetworkGraph3D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph3D'), {
  ssr: false,
});
const NetworkGraphVis = dynamic(() => import('modules/NetworkGraph/components/NetworkGraphVis'), {
  ssr: false,
});
const NetworkGraphD3 = dynamic(() => import('modules/NetworkGraph/components/NetworkGraphD3'), {
  ssr: false,
});

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface GraphDetailProps {
  name: string;
  imageUri?: string;
  json: NetworkGraphJson;
  colors: string[];
}

type ColorMode = 'community' | 'botscore';
const COLOR_MODES: ColorMode[] = ['community', 'botscore'];

// for bot score color
const colorGradient = new Gradient();
colorGradient.setGradient('#008000', '#e1000f'); // from red to green
colorGradient.setMidpoint(0.5);

const highlightNodesAndEdges = (
  data: NetworkGraphJson,
  {
    active,
    startDate,
    endDate,
    colorMode,
    colors,
  }: {
    colors: string[];
    colorMode: ColorMode;
    active?: boolean;
    startDate?: string;
    endDate?: string;
  }
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
      edge.color = '#41548e1A';
    } else {
      edge.active = true;
      edge.color = '#41548e';
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
      if (colorMode === 'botscore') {
        // @ts-ignore
        node.color = node?.metadata?.botscore
          ? colorGradient.getColor(node?.metadata?.botscore)
          : '#1b1b35AA';
        // for debug
        // console.log(`${node?.metadata?.botscore} %c${node.color}`, `color: ${node.color}`); //eslint-disable-line
      } else {
        node.color = colors[node?.community_id || 0];
      }
    }

    node.size = endDate
      ? newData.edges
          .filter((edge) => edge.active && ((edge.target as any)?.id || edge.target) === node.id)
          .reduce((acc, val) => acc + val.size, 0)
      : node.size;

    // if (active) {
    // @ts-ignore
    node.fx = node.x;
    // @ts-ignore
    node.fy = node.y;
    // @ts-ignore
    node.fz = node.z;
    // }

    return node;
  });

  return newData;
};

const GraphDetail: React.FC<GraphDetailProps> = ({ name, json, colors, imageUri }) => {
  const { queryParams, pushQueryParam } = useUrl();
  const [modalContent, setModalContent] = React.useState<React.ReactNode>();
  const [modalTitle, setModalTitle] = React.useState<React.ReactNode>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [firstTime, setFirstTime] = useState(true);

  const [colorMode, setColorMode] = React.useState<ColorMode>(
    queryParams.colorMode || COLOR_MODES[0]
  );
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
    setColorMode(queryParams.colorMode);
  }, [queryParams.colorMode, setColorMode]);

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

  const onNodeHover = React.useCallback(
    (node: any) => {
      toggleActive(true);
      setModalContent(
        <div>
          Node<pre>{JSON.stringify(node, null, 2)}</pre>
        </div>
      );
      toggleActive(false);
    },
    [setModalContent]
  );

  const onEdgeHover = React.useCallback(
    (edge: any) => {
      toggleActive(true);
      setModalContent(
        <div>
          Edge<pre>{JSON.stringify(edge, null, 2)}</pre>
        </div>
      );
      toggleActive(false);
    },
    [setModalContent]
  );

  const updateModalContent = React.useCallback(
    (node: any) => {
      setIsModalOpen(true);
      setModalContent(
        <>
          <pre>{JSON.stringify(node, null, 2)}</pre>
        </>
      );
    },
    [setModalContent]
  );

  const updateModalTitle = React.useCallback(
    (node: any) => {
      setModalTitle(<>{node.label}</>);
    },
    [setModalContent]
  );

  const onNodeClick = (node: any) => {
    updateModalContent(node);
    updateModalTitle(node);
  };

  const filteredNodes = highlightNodesAndEdges(json, {
    colors,
    colorMode,
    active,
    startDate,
    endDate,
  });

  return (
    <>
      <Modal isOpen={isModalOpen} hide={() => setIsModalOpen(false)}>
        <ModalClose hide={() => setIsModalOpen(false)} title="Close the modal window">
          Close
        </ModalClose>
        <ModalTitle icon="ri-arrow-right-fill">{modalTitle}</ModalTitle>
        <ModalContent>{modalContent}</ModalContent>
      </Modal>
      <Container spacing="mt-12w">
        <Row>
          <Col n="6">
            From <strong title={startDate}>{dayjs(startDate).format('llll')}</strong> to{' '}
            <strong title={endDate}>{dayjs(endDate).format('llll')}</strong>
          </Col>
          <Col n="4" offset="2">
            <div className="" style={{ textAlign: 'right' }}>
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
          </Col>
        </Row>

        <Row className="fr-mt-4w" justifyContent="center">
          <Col n="1">
            <TextInput
              onChange={(event) => setTickInterval(+event.target.value)}
              value={tickInterval}
              disabled={active}
              label="ms"
            />
          </Col>
          <Col className="fr-mt-4w fr-ml-2w">
            <ButtonGroup size="sm" isInlineFrom="xs">
              <Button
                onClick={() => setTick((tick || 0) - 1)}
                icon="fr-fi-arrow-left-s-line-double"
                disabled={active || (tick || 0) === 0}
              >
                Before
              </Button>
              <Button onClick={toggleActive} icon={`fr-fi-${active ? 'pause' : 'play'}-line `}>
                {active ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={() => setTick((tick || 0) + 1)}
                disabled={active || (tick || 0) === nodes.length || !tick}
                icon="fr-fi-arrow-right-s-line-double"
              >
                After
              </Button>
              <Button
                onClick={() => {
                  toggleActive(false);
                  setTick(undefined);
                }}
                disabled={tick === 0 || !tick}
                icon="fr-fi-refresh-line"
              >
                Reset
              </Button>
              {COLOR_MODES.map((colorModeInList) => (
                <Button
                  onClick={() =>
                    pushQueryParam('colorMode', undefined, { shallow: true, scroll: false })(
                      colorModeInList
                    )
                  }
                  disabled={colorMode === colorModeInList}
                >
                  {colorModeInList}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
      <Container className="fr-mt-4w">
        <Tabs>
          <Tab label="ForceGraph2D">
            <h3>
              <a target="_blank" href="https://github.vasturiano/react-force-graph">
                react-force-graph-2d
              </a>
            </h3>
            <div className={s.graphWrapper}>
              <NetworkGraph2D
                graph={filteredNodes}
                onNodeClick={onNodeClick}
                onNodeHover={onNodeHover}
                onLinkHover={onEdgeHover}
              />
            </div>
          </Tab>
          <Tab label="Generated image">
            <div className={s.graphWrapper}>
              <img src={imageUri} />
            </div>
          </Tab>
          <Tab label="ReactGraphD3">
            <h3>
              <a target="_blank" href="https://github.com/danielcaldas/react-d3-graph">
                react-graph-d3
              </a>
            </h3>
            <div className={s.graphWrapper}>
              <NetworkGraphD3
                // @ts-ignore
                graph={filteredNodes}
                onClickNode={onNodeClick}
                onHoverNode={onNodeHover}
                onHoverEdge={onEdgeHover}
              />
            </div>
          </Tab>
          <Tab label="ReactGraphVis">
            <h3>
              <a target="_blank" href="https://github.com/crubier/react-graph-vis">
                react-graph-vis
              </a>
            </h3>
            <div className={s.graphWrapper}>
              <NetworkGraphVis
                // @ts-ignore
                graph={filteredNodes}
                onClickNode={onNodeClick}
                onHoverNode={onNodeHover}
                onHoverEdge={onEdgeHover}
              />
            </div>
          </Tab>
          <Tab label="Sigma">
            <h3>
              <a target="_blank" href="https://github.com/dunnock/react-sigma">
                react-sigma
              </a>
            </h3>
            <div className={s.graphWrapper}>
              <NetworkGraph
                // @ts-ignore
                graph={filteredNodes}
                onClickNode={onNodeClick}
                onHoverNode={onNodeHover}
                onHoverEdge={onEdgeHover}
              />
            </div>
          </Tab>

          <Tab label="ForceGraph3D">
            <h3>
              <a target="_blank" href="https://github.vasturiano/react-force-graph">
                react-force-graph-3d
              </a>
            </h3>
            <div className={s.graphWrapper}>
              <NetworkGraph3D
                graph={filteredNodes}
                onNodeHover={onNodeHover}
                onLinkHover={onEdgeHover}
                onNodeClick={onNodeClick}
              />
            </div>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default GraphDetail;
