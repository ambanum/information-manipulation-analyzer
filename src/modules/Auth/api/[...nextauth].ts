import NextAuth, { User } from 'next-auth';

import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jdurand' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!process.env.BASIC_AUTH_CREDENTIALS) {
          throw new Error('No BASIC_AUTH_CREDENTIALS passed');
        }
        const [user, pass] = process.env.BASIC_AUTH_CREDENTIALS.split(':');

        if (credentials.username === user && credentials.password === pass) {
          return { name: user } as User;
        }

        return null;
      },
    }),
  ],
});
