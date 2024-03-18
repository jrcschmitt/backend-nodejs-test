const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

describe('Movies - Endpoints', () => {
  describe('GET /api/movies', () => {
    it ('should return max and min wins interval for producers - 200', done => {
      chai
      .request('http://localhost:3000')
      .get('/api/movies?projection=max-min-win-interval-for-producers')
      .end((err, res) => {
        chai.assert.isNull(err);
        chai.assert.isNotEmpty(res.body);
        res.should.have.status(200);
        res.body.should.have.property('min');
        res.body.should.have.property('max');
        res.body.min.should.be.a('array');
        res.body.max.should.be.a('array');
        done();
      });
    });
    it ('should return all movies - 200', done => {
        chai
        .request('http://localhost:3000')
        .get('/api/movies')
        .end((err, res) => {
          chai.assert.isNull(err);
          chai.assert.isNotEmpty(res.body);
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
    it ('should return invalid projection - 500', done => {
        chai
        .request('http://localhost:3000')
        .get('/api/movies?projection=test')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.have.property('text').equal('invalid projection');
          res.text.should.be.a('string');
          done();
        });
    });
  });
});
