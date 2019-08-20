/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const buildDirectory = 'dist/server';

module.exports = {
  mode: 'production',
  entry: [
    './src/server/index.jsx',
  ],
  output: {
    path: path.join(__dirname, buildDirectory),
    filename: 'bundle.js',
    publicPath: '/server',
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-transform-runtime'],
        },
      },
    }],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: [],
};
