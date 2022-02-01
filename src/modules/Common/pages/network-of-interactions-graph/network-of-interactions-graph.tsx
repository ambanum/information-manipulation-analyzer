import { Breadcrumb, BreadcrumbItem } from '@dataesr/react-dsfr';
import { Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';

import Alert from '../../components/Alert/Alert';
import { GetServerSideProps } from 'next';
import GraphDetail from 'modules/NetworkGraph/components/GraphDetail';
import Layout from 'modules/Embassy/components/Layout';
import React from 'react';
import { Select } from '@dataesr/react-dsfr';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import shuffle from 'lodash/fp/shuffle';
import useUrl from 'hooks/useUrl';

const dsfrColors = shuffle([
  '#91ae4f',
  '#107449',
  '#169b62',
  '#344f4b',
  '#008169',
  '#00ac8c',
  '#80d5c6',
  '#41548e',
  '#5770be',
  '#abb8df',
  '#d5dbef',
  '#ededf2',
  '#363a5b',
  '#484d7a',
  '#a3a6bc',
  '#d1d2de',
  '#bf6a5e',
  '#ff8d7e',
  '#ffc6be',
  '#9c6759',
  '#c0806f',
  '#ffc29e',
  '#bfae00',
  '#ead737',
  '#ffe800',
  '#fff480',
  '#fff9bf',
  '#be9b31',
  '#fdcf41',
  '#bf7330',
  '#ff9940',
  '#d0805b',
  '#bf5339',
  '#cb634b',
  '#ff6f4c',
  '#ffb7a5',
  '#5e3a44',
  '#7d4e5b',
  '#bea7ad',
  '#794e43',
  '#956052',
  '#a26859',
]);

const NetworkGraphDebugPage = ({ files, selected: selectedInUrl }: any) => {
  const { queryParams, pushQueryParam } = useUrl();
  const [selected, setSelected] = React.useState<number>(selectedInUrl);

  const onChange = (event: any) => {
    pushQueryParam('selected', undefined, { shallow: true })(event.target.value);
  };

  React.useEffect(() => {
    if (queryParams.selected) {
      setSelected(queryParams.selected);
    }
  }, [queryParams.selected]);
  const file = files[selected];

  if (!files.length) {
    return <div>No files found</div>;
  }

  const metadata = file?.json?.metadata || {};
  const selectOptions = files.map((file: any, index: number) => ({
    value: `${index}`,
    label: file.name,
    disabled: selected === index,
  }));

  return (
    <Layout title="Twitter network of interaction graph">
      <div style={{ backgroundColor: 'var(--grey-975)' }}>
        <Container className="fr-py-12w">
          <Row gutters={true}>
            <Col>
              <div className="text-center">
                <Title>search name</Title>
              </div>
              <div className="text-center" style={{ color: 'var(--grey-425)' }}>
                <Text size="sm">
                  <em>status, from, until</em>
                </Text>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="fr-mt-0">
        <Row>
          <Col>
            <Breadcrumb>
              <BreadcrumbItem href="/">Twitter</BreadcrumbItem>
              <BreadcrumbItem href="/">Explore narratives</BreadcrumbItem>
              <BreadcrumbItem href="/">$search</BreadcrumbItem>
              <BreadcrumbItem>Network of interaction graph</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
      </Container>
      <Container className="fr-mb-6w">
        <Row>
          <Col>
            <Alert size="small" className="">
              Due to the amount of data processed, the graph generation{' '}
              <strong>can take several minutes</strong> (be patient) and this requires a{' '}
              <strong>recent machine to be used properly</strong> (on mobile it is not feasible).
            </Alert>
          </Col>
        </Row>
      </Container>
      <GraphDetail
        colors={dsfrColors}
        {...file}
        imageUri={`${String(process.env.NEXT_PUBLIC_BASE_PATH)}${file.path
          .replace('.json', '.jpg')
          .replace('public/', '/')}`}
      />
      <Container spacing="mt-12w">
        <Row gutters>
          <Col n="4">
            <Select
              label="Select a file"
              onChange={onChange}
              options={selectOptions}
              selected={selected}
              size="medium"
            />
          </Col>
          <Col n="8">
            <Text size="sm" className="fr-mb-0">
              Collected from {dayjs(metadata.last_collected_date).format()} to{' '}
              {dayjs(metadata.data_collection_date).format()}{' '}
            </Text>

            <pre
              className="fr-p-1w fr text-xs"
              style={{
                fontSize: '10px',
                background: 'var(--grey-50)',
                color: 'var(--grey-950)',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}
            >
              graphgenerator "{metadata.search}" -j ./public/graph/{file.name} -i ./public/graph/
              {file.name.replace('.json', '.jpg')}
              {!!metadata.maxresults ? ` -m ${metadata.maxresults}` : ''}
              {!!metadata.minretweets ? ` -r ${metadata.minretweets}` : ''}
              {!!metadata.community_algo ? ` -c ${metadata.community_algo}` : ''}
              {!!metadata.layout_algo ? ` -a ${metadata.layout_algo}` : ''}
              <br />
              npx prettier ./public/graph/*.json --write
            </pre>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const FOLDER = 'public/graph';
  const files = fs.readdirSync(path.join(FOLDER));

  const validFiles = [];
  // let i = 0;
  for (const file of files.filter((file) => file.endsWith('.json'))) {
    try {
      const validFile: any = {
        name: file,
        path: path.join(FOLDER, file),
      };

      // if (i === +(query.selected || 1)) {
      const json = JSON.parse(fs.readFileSync(`${FOLDER}/${file}`).toString());
      validFile.json = json;
      // }
      validFiles.push(validFile);
      // i++;
    } catch (e) {
      console.error(e);
    }
  }

  return {
    props: {
      files: validFiles,
      selected: query.selected || 1,
    },
  };
};
export default NetworkGraphDebugPage;
