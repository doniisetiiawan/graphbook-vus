import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import services from './services';
import db from './database';

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

const serviceNames = Object.keys(services);

for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === 'graphql') {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`/${name}`, services[name]);
  }
}

app.get('/', (req, res, next) => {
  console.log('first function');
  next();
}, (req, res) => {
  console.log('second function');
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
