const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const app = express();
const port = 8000;

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

app.get('/', (req, res, next) => {
  console.log('first function');
  next();
}, (req, res) => {
  console.log('second function');
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
