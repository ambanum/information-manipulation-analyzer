import { Col, Container, Row } from '@dataesr/react-dsfr';
import { Tab, Tabs, Title } from '@dataesr/react-dsfr';

import Breadcrumb from 'modules/Common/components/Breadcrumb';
import { GetUserResponse } from '../../interfaces';
import Hero from 'modules/Common/components/Hero/Hero';
import Layout from 'modules/Embassy/components/Layout';
import Link from 'next/link';
import Loading from 'components/Loading';
import Overview from 'modules/Common/components/Overview/Overview';
import React from 'react';
import Tile from 'modules/Common/components/Tile/Tile';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSwr from 'swr';
import useUrl from 'hooks/useUrl';

dayjs.extend(relativeTime);

export { default as getStaticPaths } from './[user].staticPaths';
export { default as getStaticProps } from './[user].staticProps';

const ssrConfig = {
  loading: () => <Loading message="Loading..." />,
  ssr: false,
};

const UserBotScore = dynamic(() => import('../../data-components/UserBotScore'), ssrConfig);

const UserPage = ({ user }: { user: string }) => {
  const username = (user || '').replace('@', '');
  const { data } = useSwr<GetUserResponse>(`/api/users/${username}`);
  const { queryParams, pushQueryParams, queryParamsStringified } = useUrl();
  if (!username) return null;
  const image = data?.user?.profileImageUrl;

  return (
    <Layout title={`@${username} | Information Manipulation Analyzer`}>
      {/* Hero */}
      <Hero>
        <div className="fr-container fr-container--fluid fr-py-12w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col fr-p-0">
              {image && (
                <div className="text-center">
                  <img src={image} width="64" height="64" />
                </div>
              )}
              <h1 className="text-center">
                {data?.user?.displayname ? `${data?.user?.displayname}` : username}
                {data?.user?.verified && (
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    aria-label="Verified account"
                    fill="rgb(29, 161, 242)"
                  >
                    <g>
                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
                    </g>
                  </svg>
                )}
              </h1>
            </div>
          </div>
        </div>
      </Hero>

      {/* Breadcrumb */}
      <Container className="fr-mt-0">
        <Row>
          <Col>
            <Breadcrumb
              items={[
                {
                  name: 'Twitter',
                  url: `/`,
                },
                {
                  name: 'Explore narrative',
                  url: `/`,
                },
                ...(queryParams?.fromsearch
                  ? [
                      {
                        name: queryParams.fromsearch,
                        url: `/searches/${encodeURIComponent(queryParams.fromsearch)}`,
                      },
                    ]
                  : []),
                { name: `@${username}` },
              ]}
            />
          </Col>
        </Row>
      </Container>

      <Overview searchName={`@${username}`} title="Overview">
        <div className="fr-col">
          <Tile
            title={<UserBotScore type="raw" username={username} />}
            description="Bot score"
          ></Tile>
        </div>
        <div className="fr-col">
          <Tile
            title={data?.user?.followersCount?.toLocaleString('en')}
            description="Followers count"
          ></Tile>
        </div>
        <div className="fr-col">
          <Tile
            title={data?.user?.friendsCount?.toLocaleString('en')}
            description="Friends count"
          ></Tile>
        </div>
        <div className="fr-col">
          <Tile title={dayjs(data?.user?.created).fromNow(true)} description="Account age"></Tile>
        </div>
      </Overview>

      <Container className="fr-py-12w">
        <Row gutters={true}>
          <Col>
            <Title type="h3" look="h3">
              Details
            </Title>
            <Tabs className="fr-mt-2w">
              <Tab label="Account">
                <p>Some informations about this user.</p>
                <ul>
                  {username && (
                    <li>
                      <strong>Username: </strong>@{username}
                    </li>
                  )}
                  {data?.user?.displayname && (
                    <li>
                      <strong>Display name: </strong>
                      {data?.user?.displayname}
                    </li>
                  )}
                  {data?.user?.description && (
                    <li>
                      <strong>Description: </strong>
                      {data?.user?.description}
                    </li>
                  )}
                  {data?.user?.linkUrl && (
                    <li>
                      <strong>Link URL: </strong>
                      <Link href={data?.user?.linkUrl}>
                        <a target="_blank">{data?.user?.linkUrl}</a>
                      </Link>
                    </li>
                  )}
                  {data?.user?.created && (
                    <li>
                      <strong>Account age: </strong>
                      {dayjs(data?.user?.created).fromNow(true)}
                    </li>
                  )}
                  {data?.user?.location && (
                    <li>
                      <strong>Location: </strong>
                      {data?.user?.location}
                    </li>
                  )}
                  {data?.user?.friendsCount && (
                    <li>
                      <strong>Friends count: </strong>
                      {data?.user?.friendsCount?.toString()}
                    </li>
                  )}
                  {data?.user?.followersCount && (
                    <li>
                      <strong>Followers count: </strong>
                      {data?.user?.followersCount?.toString()}
                    </li>
                  )}
                  {data?.user?.favouritesCount && (
                    <li>
                      <strong>Favorite count: </strong>
                      {data?.user?.favouritesCount}
                    </li>
                  )}
                  {data?.user?.statusesCount && (
                    <li>
                      <strong>Statuses count: </strong>
                      {data?.user?.statusesCount}
                    </li>
                  )}
                  {data?.user?.mediaCount && (
                    <li>
                      <strong>Media count: </strong>
                      {data?.user?.mediaCount}
                    </li>
                  )}
                </ul>
              </Tab>
              <Tab label="Bot Score">
                <p>Some explanation.</p>
                <p>
                  For the calculation of bot probability that we obtain for this user, we use{' '}
                  <Link href="https://github.com/ambanum/social-networks-bot-finder">
                    <a target="_blank">social-networks-bot-finder</a>
                  </Link>{' '}
                  and everything you need to know about how the bot score works is detailed{' '}
                  <Link href="/bot-probability">
                    <a>on our website</a>
                  </Link>
                  .
                </p>
                <div>
                  <UserBotScore type="table" username={username} />
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default UserPage;
