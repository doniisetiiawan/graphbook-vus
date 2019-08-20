const assert = require('assert');
const request = require('request');
const { expect } = require('chai');
const should = require('chai').should();
require('babel-plugin-require-context-hook/register')();

describe('Graphbook application test', function () {
  let app;
  this.timeout(50000);

  before((done) => {
    app = require('../src/server').default;
    app.on('listening', () => {
      done();
    });
  });

  after((done) => {
    app.close(done);
  });

  it('renders and serves the index page', (done) => {
    request('http://localhost:8000', (err, res, body) => {
      should.not.exist(err);
      should.exist(res);
      expect(res.statusCode).to.be.equal(200);
      assert.ok(body.indexOf('<html') !== -1);
      done(err);
    });
  });
});
