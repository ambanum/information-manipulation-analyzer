import { Col, Container, Row } from '@dataesr/react-dsfr';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import Layout from 'modules/Embassy/components/Layout';
import { NextPage } from 'next';
import React from 'react';
import axios from 'axios';
import { serialize } from 'next-mdx-remote/serialize';

interface Props {
  mdxContent: MDXRemoteSerializeResult;
}

const GraphMethdology: NextPage<Props> = ({ mdxContent }) => {
  return (
    <Layout title="Network of interactions graph methodology - Information Manipulation Analyzer">
      <Container spacing="mt-12w">
        <Row>
          <Col className="fr-col-12 fr-col-sm-12 fr-col-md-12 fr-col-lg-10 fr-col-xl-10">
            <MDXRemote {...(mdxContent as any)} components={{}} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default GraphMethdology;

export const getStaticProps = async () => {
  try {
    const { data: content } = await axios.get(
      `https://raw.githubusercontent.com/ambanum/social-networks-graph-generator/main/explanation.md`
    );
    const mdxContent = await serialize(content);
    return { props: { mdxContent: mdxContent } };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
