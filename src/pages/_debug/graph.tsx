import { Col, Container, Row } from '@dataesr/react-dsfr';

import { GetServerSideProps } from 'next';
import GraphDetail from 'modules/NetworkGraph/components/GraphDetail';
import Layout from 'modules/Embassy/components/Layout';
import React from 'react';
import { Select } from '@dataesr/react-dsfr';
import fs from 'fs';
import path from 'path';
import shuffle from 'lodash/fp/shuffle';
import { useState } from 'react';
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

const NetworkGraphDebugPage = ({ files }: any) => {
  const { queryParams, pushQueryParam } = useUrl();
  const [selected, setSelected] = useState(queryParams.selected || 1);

  const file = files[selected];

  const onChange = (event: any) => {
    setSelected(event.target.value);
    pushQueryParam('selected', undefined, { shallow: true })(event.target.value);
  };

  if (!files.length) {
    return <div>No files found</div>;
  }
  const metadata = file.json.metadata || {};
  const selectOptions = files.map((file: any, index: number) => ({
    value: index,
    label: file.name,
  }));

  return (
    <Layout title="Twitter community graph generator">
      <Container>
        <Row>
          <Col>
            <Select
              label="Select file"
              onChange={onChange}
              options={selectOptions}
              selected={selected}
            />
            <pre
              className="fr-mx-2w fr-my-1w fr-px-1w text-xs"
              style={{ fontSize: '10px', background: '#333', color: '#FFF', borderRadius: '4px' }}
            >
              graphgenerator "{metadata.search}" -j ./public/graph/{file.name}
            </pre>
          </Col>
        </Row>
      </Container>

      <GraphDetail colors={dsfrColors} {...file} />
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps = async () => {
  const FOLDER = 'public/graph';
  const files = fs.readdirSync(path.join(FOLDER));

  const validFiles = [];
  for (const file of files.filter((file) => file.endsWith('.json'))) {
    try {
      const json = JSON.parse(fs.readFileSync(`${FOLDER}/${file}`).toString());
      validFiles.push({
        name: file,
        path: path.join(FOLDER, file),
        json,
      });
    } catch (e) {
      console.error(e);
    }
  }

  return {
    props: {
      files: validFiles,
    },
  };
};
export default NetworkGraphDebugPage;
