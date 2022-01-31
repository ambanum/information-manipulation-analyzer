import { Button, ButtonGroup, Col, Container, Row } from '@dataesr/react-dsfr';
import { Modal, ModalClose, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { Tab, Tabs } from '@dataesr/react-dsfr';

import Gradient from 'javascript-color-gradient';
import { NetworkGraphJson } from 'modules/NetworkGraph/components/NetworkGraph.d';
import React from 'react';
import { TextInput } from '@dataesr/react-dsfr';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import s from './GraphDetail.module.css';
import { useState } from 'react';
import { useToggle } from 'react-use';
import useUrl from 'hooks/useUrl';

const NetworkGraph2D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph2D'), {
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

type PositionMode = 'auto' | 'fixed';
const POSITION_MODES: PositionMode[] = ['auto', 'fixed'];

// for bot score color
const colorGradient = new Gradient();
colorGradient.setGradient('#008000', '#e1000f'); // from red to green
colorGradient.setMidpoint(1);

[0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99].forEach((col) => {
  console.log(`${col} %c${colorGradient.getColor(col)}`, `color: ${colorGradient.getColor(col)}`);
});

const highlightNodesAndEdges = (
  data: NetworkGraphJson,
  {
    startDate,
    endDate,
    colorMode,
    colors,
  }: {
    colors: string[];
    colorMode: ColorMode;
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

    return node;
  });

  return newData;
};

const fixNodePositions = (
  data: NetworkGraphJson,
  { auto, active }: { auto: boolean; active: boolean }
) => {
  const newData = { ...data };

  newData.nodes.map((node) => {
    if (!auto || (auto && active)) {
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

const GraphDetail: React.FC<GraphDetailProps> = ({ name, json, colors, imageUri }) => {
  const { queryParams, pushQueryParam } = useUrl();
  const [modalContent, setModalContent] = React.useState<React.ReactNode>();
  const [modalTitle, setModalTitle] = React.useState<React.ReactNode>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [firstTime, setFirstTime] = useState(true);

  const [colorMode, setColorMode] = React.useState<ColorMode>(
    queryParams.colorMode || COLOR_MODES[0]
  );
  const [positionMode, setPositionModeMode] = React.useState<PositionMode>(
    queryParams.positionMode || POSITION_MODES[0]
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
    if (queryParams.colorMode) {
      setColorMode(queryParams.colorMode);
    }
  }, [queryParams.colorMode, setColorMode]);

  React.useEffect(() => {
    if (queryParams.positionMode) {
      setPositionModeMode(queryParams.positionMode);
    }
  }, [queryParams.positionMode, setPositionModeMode]);

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

  const onEdgeClick = React.useCallback(
    (edge: any) => {
      setModalContent(
        <div>
          Edge<pre>{JSON.stringify(edge, null, 2)}</pre>
        </div>
      );
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
    startDate,
    endDate,
  });
  const auto = positionMode === 'auto';
  const positionedNodes = fixNodePositions(filteredNodes, { auto, active });

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
              onChange={(event: any) => setTickInterval(+event.target.value)}
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
            </ButtonGroup>
          </Col>
          <Col className="fr-mt-4w fr-ml-2w">
            <ButtonGroup size="sm" isInlineFrom="xs">
              {COLOR_MODES.map((colorModeInList) => (
                <Button
                  key={colorModeInList}
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
          <Col className="fr-mt-4w fr-ml-2w">
            <ButtonGroup size="sm" isInlineFrom="xs">
              {POSITION_MODES.map((positionModeInList) => (
                <Button
                  key={positionModeInList}
                  onClick={() =>
                    pushQueryParam('positionMode', undefined, { shallow: true, scroll: false })(
                      positionModeInList
                    )
                  }
                  disabled={positionMode === positionModeInList}
                >
                  {positionModeInList}
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
                graph={positionedNodes}
                onNodeClick={onNodeClick}
                onLinkClick={onEdgeClick}
                auto={auto}
              />
            </div>
          </Tab>
          <Tab label="Generated image">
            <div className={s.graphWrapper}>
              <img src={imageUri} />
            </div>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default GraphDetail;
