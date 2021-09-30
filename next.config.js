const { version } = require('./package.json');

module.exports = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  webpack5: true,
  publicRuntimeConfig: {
    version,
  },
  experimental: {
    pageDataCollectionTimeout: 200,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified by next.js will be dropped. Doesn't make much sense, but how it is

      // Solution for: "Module not found: Can't resolve 'fs'"
      fs: false,

      // Solution for: "Module not found: Can't resolve 'child_process'"
      child_process: false,
    };

    return config;
  },
};
