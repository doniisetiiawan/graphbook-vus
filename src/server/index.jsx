/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { Helmet } from 'react-helmet';
import config from '../../webpack.server.config';
import ApolloClient from './ssr/apollo';
import Graphbook from './ssr';
import template from './ssr/template';

import servicesLoader from './services';
import db from './database';

const utils = {
  db,
};
const services = servicesLoader(utils);

const app = express();
const port = 8000;

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', '*.amazonaws.com'],
    },
  }));
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
  app.use(cors());
  app.use(compression());
}

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

const serviceNames = Object.keys(services);

for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === 'graphql') {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`/${name}`, services[name]);
  }
}

app.get('*', (req, res) => {
  const client = ApolloClient(req);
  const context = {};
  const App = (
    <Graphbook
      client={client}
      location={req.url}
      context={context}
    />
  );
  const content = ReactDOM.renderToString(App);
  if (context.url) {
    res.redirect(301, context.url);
  } else {
    const head = Helmet.renderStatic();
    res.status(200);
    res.send(`<!doctype html>\n${template(content, head)}`);
    res.end();
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
