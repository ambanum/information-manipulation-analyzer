import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import Breadcrumb from 'modules/Common/components/Breadcrumb/Breadcrumb';
import BreadcrumbItem from 'modules/Common/components/Breadcrumb/BreadcrumbItem';
import Layout from 'modules/Embassy/components/Layout';
import { NextPage } from 'next';
import React from 'react';
import axios from 'axios';
import { serialize } from 'next-mdx-remote/serialize';
import { useRouter } from 'next/router';

interface Props {
  mdxContent: MDXRemoteSerializeResult;
}

const BotProbability: NextPage<Props> = ({ mdxContent }) => {
  const router = useRouter();

  return (
    <Layout title="Bot Probability - Information Manipulation Analyzer">
      <div className="fr-container fr-container-fluid">
        <div className="fr-grid-row">
          <div className="fr-col fr-col-12 ">
            <Breadcrumb>
              <BreadcrumbItem href=" " onClick={() => router.back()}>
                Back
              </BreadcrumbItem>
              <BreadcrumbItem isCurrent={true}>What is a bot ?</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <div className="fr-container fr-container-fluid fr-my-2w">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col fr-col-12 fr-col-sm-12 fr-col-md-12 fr-col-lg-10 fr-col-xl-10">
            <MDXRemote {...(mdxContent as any)} components={{}} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BotProbability;

export const getStaticProps = async () => {
  try {
    const { data: content } = await axios.get(
      `https://raw.githubusercontent.com/ambanum/social-networks-bot-finder/main/explanation.md`
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
