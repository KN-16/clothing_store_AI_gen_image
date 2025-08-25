// const path = require('path');

// module.exports = function override(config, env) {
//   config.resolve.alias = {
//     ...config.resolve.alias,
//     '@': path.resolve(__dirname, 'src'),
//   };
//   return config;
// };

const path = require('path');

module.exports = function override(config, env) {
  // Add the alias for '@' to point to the 'src' folder
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'), // Point '@' to the 'src' folder
    },
  };

  return config;
};