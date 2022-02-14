import { Callout, CalloutText, CalloutTitle } from '@dataesr/react-dsfr';
import { Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';

import Alert from 'modules/Common/components/Alert/Alert';
import { Button } from '@dataesr/react-dsfr';
import { GraphSearchResponse } from '../interfaces';
import Link from 'next/link';
import Loading from 'components/Loading';
import React from 'react';
import api from 'utils/api';
import useSWR from 'swr';
import { useToggle } from 'react-use';

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
        <Row>
          <Col>
            <Callout colorFamily="beige-gris-galet">
              <CalloutTitle size="lg">Network of interaction graph</CalloutTitle>
              <CalloutText size="sm">
                Visually explore a narrative and replay its propagation up to 7 days back.
              </CalloutText>
              {loading && <Loading size="sm" />}
              {data?.status === 'ko' && <Alert type="error">{data.error}</Alert>}
              {data?.status === 'ok' && (
                <>
                  {data?.searchGraph && (
                    <Link href={`/network-of-interactions-graph/${encodedSearch}`}>
                      <a>
                        <Button title="create">Explore the graph</Button>
                      </a>
                    </Link>
                  )}
                  {!data?.searchGraph && (
                    <Button title="create" onClick={createGraph} disabled={creating}>
                      {creating ? <Loading size="sm" /> : 'Create now'}
                    </Button>
                  )}
                </>
              )}
            </Callout>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GraphCreator;
