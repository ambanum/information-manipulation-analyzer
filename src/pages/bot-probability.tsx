import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import Layout from 'modules/Embassy/components/Layout';
import { NextPage } from 'next';
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
      <div className="fr-container fr-mb-12w">
        <div className="fr-grid-row">
          <div className="fr-col fr-col-12 ">
            <div className="text-center fr-myw fr-mb-2w">
              <a
                href=" "
                onClick={() => router.back()}
                className="fr-link fr-fi-arrow-left-line fr-link--icon-left"
              >
                Back
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="fr-container fr-container-fluid fr-my-6w">
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
