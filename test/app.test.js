const assert = require('assert');
const request = require('request');
const { expect } = require('chai');
const should = require('chai').should();
require('babel-plugin-require-context-hook/register')();

describe('Graphbook application test', function () {
  let app;
  let authToken;
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

    it('allows the user to sign up', (done) => {
      const json = {
        operationName: null,
        query: 'mutation signup($username: String!, $email : String!, $password : String!) { signup(username: $username, email: $email, password : $password) { token }}',
        variables: {
          email: 'mocha@test.com',
          username: 'mochatest',
          password: '123456789',
        },
      };

      request.post({
        url: 'http://localhost:8000/graphql',
        json,
      }, (err, res, body) => {
        should.not.exist(err);
        should.exist(res);
        expect(res.statusCode).to.be.equal(200);
        body.should.be.an('object');
        body.should.have.property('data');
        authToken = body.data.signup.token;
        done(err);
      });
    });

    it('allows the user to query all chats', (done) => {
      const json = {
        operationName: null,
        query: 'query {chats {id users {id avatar username}}}',
        variables: {},
      };

      request.post({
        url: 'http://localhost:8000/graphql',
        headers: {
          Authorization: authToken,
        },
        json,
      }, (err, res, body) => {
        should.not.exist(err);
        should.exist(res);
        expect(res.statusCode).to.be.equal(200);
        body.should.be.an('object');
        body.should.have.property('data');
        body.data.should.have.property('chats').with.lengthOf(0);
        done(err);
      });
    });
  });
});
