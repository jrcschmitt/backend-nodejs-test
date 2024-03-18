const loki = require('lokijs');
const csvtojson = require('csvtojson');

function databaseInitialize() {
  let movies = db.getCollection('movies');

  if (movies === null) {
    movies = db.addCollection('movies');
  }

  csvtojson({
    delimiter: 'auto',
    checkType: true,
    trim: true,
  })
  .fromFile(`${__dirname}/import/movielist.csv`)
  .then(jsonObj => {
    for (const obj of jsonObj) {
      obj.producers = obj
        .producers
        .replace(', and ', ',')
        .replace(' and ', ',')
        .split(',')
        .map(p => p.trim());
      obj.studios = obj
        .studios
        .replace(', and ', ',')
        .replace(' and ', ',')
        .split(',')
        .map(s => s.trim());
      obj.winner = obj.winner === 'yes';
    }
    movies.insert(jsonObj);
  });
}

const db = new loki('golden-raspberry-awards.db', {
  autoload: true,
  autoloadCallback: databaseInitialize,
});

module.exports = db;
