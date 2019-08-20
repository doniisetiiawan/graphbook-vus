/* eslint-disable import/no-extraneous-dependencies */
require('@babel/register')({
  plugins: [
    'require-context-hook',
    'react-loadable/babel',
    'dynamic-import-node',
  ],
  presets: ['@babel/preset-env', '@babel/preset-react'],
});
