import Layout from 'modules/Embassy/components/Layout';

const HomePage = () => {
  return (
    <Layout title="Open - Information Manipulation Analyzer">
      <div className="rf-container rf-mb-12w">
        <div className="rf-grid-row">
          <div className="rf-col">
            <h1 className="text-center rf-mb-1w">
              Information Manipulation Analyzer
              <sup>
                <span
                  style={{
                    background: 'var(--rm500)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  className="rf-tag rf-tag--sm"
                >
                  BETA
                </span>
              </sup>
            </h1>
            <p
              className="rf-text--lg text-center rf-mb-7w"
              style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}
            >
              Disinfo is an Open "State Startup", which means it operates fully transparent and
              shares its metrics, like traffic and data.
            </p>
            TODO
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
