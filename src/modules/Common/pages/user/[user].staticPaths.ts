import * as UserManager from '../../managers/UserManager';

import { GetStaticPaths } from 'next';
import dbConnect from 'utils/db';

export const getStaticPaths: GetStaticPaths<{
  user: string;
}> = async () => {
  await dbConnect();
  const users = await UserManager.list({ limit: 10000 });
  return {
    paths: users.map(({ username }) => ({ params: { user: username } })), //indicates that no page needs be created at build time
    fallback: true,
  };
};

export default getStaticPaths;
