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

  describe('404', () => {
    it('redirects the user when not matching path is found', (done) => {
      request({
        url: 'http://localhost:8000/path/to/404',
      }, (err, res, body) => {
        should.not.exist(err);
        should.exist(res);
        expect(res.statusCode).to.be.equal(200);
        assert.ok(res.req.path === '/');
        assert.ok(body.indexOf('<html') !== -1);
        assert.ok(body.indexOf('class="authModal"') !== -1);
        done(err);
      });
    });
  });

  describe('authentication', () => {
    it('redirects the user when not logged in', (done) => {
      request({
        url: 'http://localhost:8000/app',
      }, (err, res, body) => {
        should.not.exist(err);
        should.exist(res);
        expect(res.statusCode).to.be.equal(200);
        assert.ok(res.req.path === '/');
        assert.ok(body.indexOf('<html') !== -1);
        assert.ok(body.indexOf('class="authModal"') !== -1);
        done(err);
      });
    });
  });
});
