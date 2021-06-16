import Layout from 'modules/Embassy/components/Layout';
import { useRouter } from 'next/router';

const BotProbability = () => {
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
          <div className="fr-col fr-col-12 ">
            <h1 className="text-center">What is the bot probability score ?</h1>
          </div>
        </div>
      </div>
      <div className="fr-container fr-container-fluid fr-my-6w">
        {/* Todo : Use markdown file explanation from https://github.com/ambanum/social-networks-bot-finder  */}
        <p>We will soon explain here how we calculate the score.</p>
      </div>
    </Layout>
  );
};

export default BotProbability;
