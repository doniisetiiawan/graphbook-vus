const express = require('express');

const app = express();
const port = 8000;

app.get('/', (req, res, next) => {
  console.log('first function');
  next();
}, (req, res) => {
  console.log('second function');
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
