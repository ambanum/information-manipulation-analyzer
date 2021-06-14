const { version } = require('./package.json');

module.exports = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  future: {
    webpack5: true,
  },
  publicRuntimeConfig: {
    version,
  },
};
