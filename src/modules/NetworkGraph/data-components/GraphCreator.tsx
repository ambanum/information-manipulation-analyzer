import React from 'react';
import Link from 'next/link';
import { Button } from '@dataesr/react-dsfr';
import { Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import { GraphSearchResponse } from '../interfaces';
import useSWR from 'swr';
import api from 'utils/api';
import { useRouter } from 'next/router';
import Loading from 'components/Loading';
import Alert from 'modules/Common/components/Alert/Alert';
import { useToggle } from 'react-use';

type GraphCreatorProps = {
  search: string;
} & React.HTMLAttributes<HTMLDivElement>;

const GraphCreator: React.FC<GraphCreatorProps> = ({ search, ...props }) => {
  const encodedSearch = encodeURIComponent(search);
  const [creating, toggleCreating] = useToggle(false);
  const router = useRouter();
  const { data, isValidating } = useSWR<GraphSearchResponse>(`/api/graph/${encodedSearch}`);
  const createGraph = async () => {
    toggleCreating(true);
    await api.post(`/api/graph`, { search });
    router.push(`/network-of-interactions-graph/${encodedSearch}`);
  };

  const loading = isValidating && !data;

  return (
    <div {...props}>
      <Container className="">
        <Row>
          <Col>
            <hr />
            <Title as="h4" look="h4">
              Network of interaction graph
            </Title>
          </Col>
        </Row>
        <Row gutters alignItems="middle">
          <Col n="12" className="fr-col-md-8">
            <Text size="md" className="fr-mb-0">
              New: you now have the possibility to generate an network of interaction graph, which
              allows you to visually explore a narrative and replay its propagation. This feature
              allows you to explore up to 7 days back in time.
            </Text>
          </Col>
          <Col n="12" className="fr-col-md-4">
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GraphCreator;
