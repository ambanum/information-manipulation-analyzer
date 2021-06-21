import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { GetStaticProps } from 'next';
import Layout from 'modules/Embassy/components/Layout';
import axios from 'axios';
import { serialize } from 'next-mdx-remote/serialize';
import { useRouter } from 'next/router';

interface Props {
  mdxContent: MDXRemoteSerializeResult;
}

const BotProbability = ({ mdxContent }: Props) => {
  const router = useRouter();
  console.log(mdxContent);

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
          <div className="fr-col fr-col-12 ">
            <h1 className="text-center">What is the bot probability score ?</h1>
          </div>
        </div>
      </div>
      <div className="fr-container fr-container-fluid fr-my-6w">
        {/* Todo : Use markdown file explanation from https://github.com/ambanum/social-networks-bot-finder  */}
        <p>We will soon explain here how we calculate the score.</p>
        {/* {<MDXRemote {...(mdxContent as any)} components={{}} />} */}
      </div>
    </Layout>
  );
};

export default BotProbability;

/* export const getStaticProps = async () => {
  try {
    const { data: content } = await axios.get(
      `https://raw.githubusercontent.com/ambanum/social-networks-bot-finder/main/explanation.md`
    );
    const mdxContent = await serialize('#test');  

    console.log('yoyo ::: ', { mdxContent: JSON.parse(JSON.stringify({ mdxContent: '#toto' })) });
    return { props: {} };
    return { props: { mdxContent: JSON.parse(JSON.stringify({ mdxContent })) } };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
 */
export const getStaticProps: GetStaticProps<MDXRemoteSerializeResult> = async () => {
  const mdxSource = await serialize('some *mdx* content: <ExampleComponent />');
  return { props: { mdxSource } };
};
