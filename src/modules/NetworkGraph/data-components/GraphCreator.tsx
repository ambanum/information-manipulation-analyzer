import { Callout, CalloutText, CalloutTitle } from '@dataesr/react-dsfr';
import { Col, Container, Link as LinkDSFR, Row, Text, Title } from '@dataesr/react-dsfr';

import Alert from 'modules/Common/components/Alert/Alert';
import { Button } from '@dataesr/react-dsfr';
import { GraphSearchResponse } from '../interfaces';
import Link from 'next/link';
import Loading from 'components/Loading';
import React from 'react';
import api from 'utils/api';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import useSWR from 'swr';
import { useToggle } from 'react-use';

dayjs.extend(localizedFormat);

type GraphCreatorProps = {
  search: string;
} & React.HTMLAttributes<HTMLDivElement>;

const GraphCreator: React.FC<GraphCreatorProps> = ({ search, ...props }) => {
  const encodedSearch = encodeURIComponent(search);
  const [creating, toggleCreating] = useToggle(false);
  const { data, isValidating, mutate } = useSWR<GraphSearchResponse>(`/api/graph/${encodedSearch}`);
  const createGraph = async () => {
    toggleCreating(true);
    await api.post(`/api/graph`, { search });
    // @ts-ignore
    mutate(`/api/graph/${encodedSearch}`);
  };

  const loading = isValidating && !data;

  return (
    <div {...props}>
      <Container className="">
        {!data?.searchGraph && (
          <Row className="fr-mb-2w">
            <Col>
              <Callout colorFamily="beige-gris-galet">
                <CalloutTitle size="lg">Network of interaction graph</CalloutTitle>
                <CalloutText size="sm">
                  Visually explore a narrative and replay its propagation up to 7 days back.
                </CalloutText>

                {data?.status === 'ko' && <Alert type="error">{data.error}</Alert>}
                {data?.status === 'ok' && (
                  <Button title="create" onClick={createGraph} disabled={creating}>
                    Create now
                  </Button>
                )}
              </Callout>
            </Col>
          </Row>
        )}
        {data?.searchGraph && (
          <>
            <Row className="">
              <Col>
                <hr />
              </Col>
            </Row>

            <Row alignItems="middle">
              <Col>
                <Title as="h4" look="h4">
                  Network of interaction graph
                </Title>
              </Col>
              <Col className="text-right">
                {creating && <Loading size="sm" />}
                {!creating && data?.searchGraph?.createdAt && (
                  <>
                    <Link href={`/network-of-interactions-graph/${encodedSearch}`}>
                      <a className="fr-link fr-fi-arrow-right-line fr-link--icon-right">
                        View the graph
                      </a>
                    </Link>
                    <Text size="sm">
                      Created the {dayjs(data.searchGraph.createdAt).format('llll')}
                    </Text>
                  </>
                )}
              </Col>
            </Row>

            <Row className="">
              <Col>
                <hr />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default GraphCreator;
