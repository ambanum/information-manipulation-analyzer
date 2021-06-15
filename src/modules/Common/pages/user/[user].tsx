import { GetUserResponse } from '../interfaces';
import Layout from 'modules/Embassy/components/Layout';
import Link from 'next/link';
import React from 'react';
import useSwr from 'swr';

export { default as getStaticPaths } from './[user].staticPaths';
export { default as getStaticProps } from './[user].staticProps';

const UserPage = ({ user }: { user: String }) => {
  const username = user.replace('@', '');
  const { data, isValidating } = useSwr<GetUserResponse>(`/api/users/${username}`);

  /*   console.log(('data', data));
  console.log(('isValidating', isValidating));
 */
  const image = data?.user?.profileImageUrl;

  return (
    <Layout title={`@${username} | Information Manipulation Analyzer`}>
      <div className="fr-container fr-mb-12w">
        <div className="fr-grid-row">
          <div className="fr-col">
            <div className="text-center fr-myw">
              <Link href="/">
                <a className="fr-link fr-fi-arrow-left-line fr-link--icon-left">Back</a>
              </Link>
            </div>
            <h1 className="text-center">{`@${username}`}</h1>
            <h6 className="text-center">
              Information Manipulation Analyzer
              <sup>
                <span
                  style={{
                    background: 'var(--rm500)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  className="fr-tag fr-tag--sm"
                >
                  BETA
                </span>
              </sup>
            </h6>
          </div>
        </div>
      </div>
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--gutters">
          <ul>
            <li>Name : {data?.user?.displayname}</li>
            <li>Description : {data?.user?.description}</li>
            <li>Favorites count : {data?.user?.favouritesCount}</li>
            <li>Followers count : {data?.user?.followersCount}</li>
            <li>Friends count : {data?.user?.followersCount}</li>
            <li>Link Url : {data?.user?.linkUrl}</li>
            <li>Location : {data?.user?.location}</li>
            <li>Location : {data?.user?.location}</li>
            <li>Image url : {data?.user?.profileImageUrl}</li>
            <li>Verified : {data?.user?.verified ? 'true' : 'false'}</li>
          </ul>
          {/* {image && <img src={image} width="40" height="40" className={s.imageWrapper_img} />} */}
        </div>
      </div>
    </Layout>
  );
};

export default UserPage;
