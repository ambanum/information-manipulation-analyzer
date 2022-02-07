import React from 'react';
import Link from 'next/link';
import { Button } from '@dataesr/react-dsfr';
import { Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';

type GraphCreatorProps = {
  search: string;
} & React.HTMLAttributes<HTMLDivElement>;

const GraphCreator: React.FC<GraphCreatorProps> = ({ search, ...props }) => {
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
            <Link href={`/network-of-interactions-graph/${encodeURIComponent(search)}`}>
              <a>
                <Button title="create">Create now</Button>
              </a>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GraphCreator;
