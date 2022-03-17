import { Button, ButtonGroup, Col, Container, Row } from '@dataesr/react-dsfr';
import { Link, Radio, RadioGroup, Text, Title } from '@dataesr/react-dsfr';
import { Modal, ModalClose, ModalContent, ModalTitle } from '@dataesr/react-dsfr';

import { TwitterTweetEmbed } from 'react-twitter-embed';
import Loading from 'components/Loading';

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
  json: NetworkGraphJson;
  colors: string[];
}

type ColorMode = 'community' | 'botscore';
const COLOR_MODES: ColorMode[] = ['community', 'botscore'];

type PositionMode = 'auto' | 'fixed';
const POSITION_MODES: PositionMode[] = ['fixed', 'auto'];

// for bot score color
const colorGradient = new Gradient();
colorGradient.setGradient('#008941', '#6A6A6A', '#E10600'); // from red to green
colorGradient.setMidpoint(1);

// [0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99].forEach((col) => {
//   console.log(`${col} %c${colorGradient.getColor(col)}`, `color: ${colorGradient.getColor(col)}`);
// });

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
        node.color = !isNaN(node?.metadata?.botscore)
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

const GraphDetail: React.FC<GraphDetailProps> = ({ name, json, colors }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
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
  const { nodes = [], edges = [] } = json || {};

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
      const notEmptyTweets = (node.metadata?.tweets || []).filter(Boolean);
      const notEmptyRetweets = (node.metadata?.retweets || []).filter(Boolean);
      const notEmptyQuoted = (node.metadata?.quoted || []).filter(Boolean);

      setIsModalOpen(true);
      setModalContent(
        <>
          {/* <pre>{JSON.stringify(node, null, 2)}</pre> */}
          <Title as="h6" look="h6">
            Tweets: {notEmptyTweets.length}
          </Title>
          {notEmptyTweets?.map((tweet: any) => {
            return (
              <TwitterTweetEmbed
                tweetId={tweet.split('/').pop()}
                placeholder={<Loading size="sm" />}
              />
            );
          })}

          <Title as="h6" look="h6">
            Edges: {node.metadata?.dates_edges?.length}
          </Title>
          {/* <div style={{ border: '1px solid var(--grey-950' }} className="fr-p-2w fr-mb-2w">
            <Text size="sm" className="fr-mb-0">
              {node.metadata?.dates_edges?.map((_: any, index: number) => {
                return (
                  <Text as="span">{dayjs(node.dates_edge?.dates[index]).format('llll')} - </Text>
                );
              })}
            </Text>
          </div> */}
          <Title as="h6" look="h6">
            Retweets: {notEmptyRetweets.length}
          </Title>
          <Title as="h6" look="h6">
            Quoted: {notEmptyQuoted.length}
          </Title>

          <Title as="h6" look="h6">
            Botscore: {node.metadata?.botscore}
          </Title>
          <Title as="h6" look="h6">
            Community ID: {node.community_id}
          </Title>
          <Title as="h6" look="h6">
            Node size: {node.size}
          </Title>
        </>
      );
    },
    [setModalContent]
  );

  const updateModalTitle = React.useCallback(
    (node: any) => {
      setModalTitle(
        <Title as="h2" look="h2">
          {node.label}
        </Title>
      );
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
      <div style={{ backgroundColor: '#00006D', position: 'relative' }}>
        <div className={s.graphOptions}>
          <Title as="h6" look="h6">
            Options
          </Title>
          <RadioGroup legend="Color nodes by">
            {COLOR_MODES.map((colorModeInList) => (
              <Radio
                label={colorModeInList}
                value={colorModeInList}
                onClick={() =>
                  pushQueryParam('colorMode', undefined, { shallow: true, scroll: false })(
                    colorModeInList
                  )
                }
                defaultChecked={colorMode === colorModeInList}
              />
            ))}
          </RadioGroup>
          <RadioGroup legend="Layout ">
            {POSITION_MODES.map((positionModeInList) => (
              <Radio
                label={positionModeInList}
                value={positionModeInList}
                onClick={() =>
                  pushQueryParam('positionMode', undefined, { shallow: true, scroll: false })(
                    positionModeInList
                  )
                }
                defaultChecked={positionMode === positionModeInList}
              />
            ))}
          </RadioGroup>
          <TextInput
            onChange={(event: any) => setTickInterval(+event.target.value)}
            value={tickInterval}
            disabled={active}
            label="Play speed"
          />
          <Text size="sm">
            To learn more about how we generate this graph{' '}
            <Link
              href="https://github.com/ambanum/social-networks-graph-generator/blob/main/explanation.md"
              target="_blank"
            >
              read the explanation here.
            </Link>
          </Text>
        </div>
        <div ref={wrapperRef} style={{ zIndex: 0 }}>
          <NetworkGraph2D
            graph={positionedNodes}
            onNodeClick={onNodeClick}
            onLinkClick={onEdgeClick}
            auto={auto}
            width={wrapperRef?.current?.clientWidth}
            height={740}
          />
        </div>
      </div>
      <div style={{ backgroundColor: '#1e1e1e' }}>
        <Container>
          <Row className="" justifyContent="center">
            <Col className="fr-mt-4w fr-ml-2w">
              <ButtonGroup size="sm" isInlineFrom="xs" align="center">
                <Button
                  onClick={() => setTick((tick || 0) - 1)}
                  icon="fr-fi-arrow-left-s-line-double"
                  disabled={active || (tick || 0) === 0}
                >
                  Previous
                </Button>
                <Button onClick={toggleActive} icon={`fr-fi-${active ? 'pause' : 'play'}-line `}>
                  {active ? 'Pause' : 'Play'}
                </Button>
                <Button
                  onClick={() => setTick((tick || 0) + 1)}
                  disabled={active || (tick || 0) === nodes.length || !tick}
                  icon="fr-fi-arrow-right-s-line-double"
                >
                  Next
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
              <div style={{ color: 'var(--grey-850)' }}>
                <Text className="text-center fr-mb-0">
                  From <strong title={startDate}>{dayjs(startDate).format('llll')}</strong> to{' '}
                  <strong title={endDate}>{dayjs(endDate).format('llll')}</strong>
                </Text>
                <Text size="sm" className="text-center fr-mt-0">
                  <strong>{tick || 0}</strong> / {dates.length} dates{' '}
                  <strong>{nodes.length}</strong> nodes <strong>{edges.length}</strong> edges
                </Text>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default GraphDetail;
