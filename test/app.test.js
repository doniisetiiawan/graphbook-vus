const assert = require('assert');
const request = require('request');
const { expect } = require('chai');
const should = require('chai').should();

describe('Graphbook application test', () => {
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
