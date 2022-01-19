import { Col, Container, Row } from '@dataesr/react-dsfr';

import Layout from 'modules/Embassy/components/Layout';
import React from 'react';
import { useRouter } from 'next/router';

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy - Information Manipulation Analyzer">
      <Container spacing="mt-12w">
        <Row>
          <Col className="fr-col-12 fr-col-sm-12 fr-col-md-12 fr-col-lg-10 fr-col-xl-10">
            <h1>Privacy Policy</h1>

            <p>
              This policy explains when and why we collect personal information, how we use it and
              the conditions under which we may disclose it to others. By using our service, you’re
              agreeing to be bound by this policy. We may change this policy from time to time, so
              please check this page occasionally to ensure that you’re happy with any changes. This
              policy was last updated on August 8, 2021.
            </p>

            <h2>What personal information do we collect ?</h2>

            <p>
              Once a request is launched on a specific hashtag, data is extracted from Twitter and
              displayed by Information Manipulation Analyzer. Among these data, one may find:
            </p>
            <ul>
              <li>Date of first appearance for a specific hashtag</li>
              <li>Number of active users</li>
              <li>Number of associated hashtags</li>
              <li>Total number of tweets</li>
              <li>
                Indications about the most active users: name, user name, followers count, friends
                count, statuses count, account age, number of uses of a hashtag, bot probability.
                The way we calculate this bot probability is clearly explained here.
              </li>
            </ul>

            <p>
              Under article 17 of the GDPR, individuals have the right to have their personal data
              erased. They can send an email to ima@disinfo.beta.gouv.fr to deny a bot probability
              or to have personal data about their own Twitter account deleted from Information
              Manipulation Analyzer.
            </p>

            <h2>What personal information do we collect from the people who visit our website ?</h2>

            <p>
              We do not share any personal information regarding the people who visit our website
              with third-party actors. We only use cookies. Cookies are small files that a site or
              its service provider transfers to your computer's hard drive through your Web browser
              (if you allow) that enables the site's or service provider's systems to recognize your
              browser and capture and remember certain information. We use cookies to help us
              compile aggregate data about site traffic and site interaction so that we can offer
              better site experiences and tools in the future.
            </p>

            <p>
              Any questions regarding this policy and our privacy practices should be sent by email
              to ima@disinfo.beta.gouv.fr.
            </p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
