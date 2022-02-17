FROM node:16-alpine3.14

RUN mkdir -p /usr/src/app

ENV PORT 3000


WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

COPY . /usr/src/app

# Run install before setting NODE_ENV to install all development modules
RUN yarn

ENV NODE_ENV=production

###### When switching to node 17
# prevent HookWebpackError: error:0308010C:digital envelope routines::unsupported with --openssl-legacy-provider
# See https://github.com/webpack/webpack/issues/14532
# ENV NODE_OPTIONS='--max_old_space_size=8192 --openssl-legacy-provider'
######
ENV NODE_OPTIONS='--max_old_space_size=8192'

RUN yarn build

RUN rm -Rf node_modules
RUN yarn --production

RUN yarn cache clean

EXPOSE 3000
CMD [ "yarn", "start" ]
