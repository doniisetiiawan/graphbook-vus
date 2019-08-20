/* eslint-disable import/no-extraneous-dependencies */
require('@babel/register')({
  plugins: [
    'require-context-hook',
  ],
  presets: ['@babel/preset-env', '@babel/preset-react'],
});
