import { Col, Container, Row } from '@dataesr/react-dsfr';

import Layout from 'modules/Embassy/components/Layout';
import React from 'react';

export default function LegalNotice() {
  return (
    <Layout title="Legal Notice - Information Manipulation Analyzer">
      <Container spacing="mt-12w">
        <Row>
          <Col className="fr-col-12 fr-col-sm-12 fr-col-md-12 fr-col-lg-10 fr-col-xl-10">
            <h1>Legal Notice</h1>
            <h2>Editor</h2>
            <p>
              Office of the Ambassador for Digital Affairs
              <br />
              Ministère de l’Europe et des affaires étrangères
              <br />
              37 Quai d’Orsay, 75015 Paris, France
            </p>
            <h2>Editorial Director</h2>
            <p>Ambassador for Digital Affairs, Henri Verdier.</p>

            <h2>Hosting provider</h2>
            <p>
              https://www.ovhtelecom.fr/
              <br />
              2 rue Kellermann, 59100 Roubaix, France
              <br />
              +33 1007
            </p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
