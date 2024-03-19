const db = require('../../../database');

const getMovies = async (projection) => {
  const movies = db.getCollection('movies');
  if (projection) {
    if (projection === 'max-min-win-interval-for-producers') {
      const winnerMovies = movies.find({winner: true});
      const moviesByProducer = groupMoviesByProducer(winnerMovies);
      const intervals = calculateYearsIntervalsByProducers(moviesByProducer);
      const {
        minInterval,
        maxInterval,
      } = calculateMaxAndMinInterval(intervals);
      const minIntervalProducers = findMinIntervalProducers(intervals, minInterval);
      const maxIntervalProducers = findMaxIntervalProducers(intervals, maxInterval);
      return {
        min: minIntervalProducers.map(p => ({
          producer: p.producer,
          interval: p.interval,
          previousWin: p.firstWinYear,
          followingWin: p.lastWinYear,
        })),
        max: maxIntervalProducers.map(p => ({
          producer: p.producer,
          interval: p.interval,
          previousWin: p.firstWinYear,
          followingWin: p.lastWinYear,
        })),
      };
    } else {
      throw Error('invalid projection');
    }
  }
  return movies.find();
}

const groupMoviesByProducer = (movies) => {
  return movies.reduce((acc, movie) => {
    movie.producers.forEach(producer => {
      if (!acc[producer]) {
        acc[producer] = [];
      }
      acc[producer].push(movie);
    });
    return acc;
  }, {});
}

const calculateYearsIntervalsByProducers = (groupedByProducer) => {
  const intervals = {};
  for (const producer in groupedByProducer) {
    const moviesByProducer = groupedByProducer[producer];
    moviesByProducer.sort((a, b) => a.year - b.year);
    intervals[producer] = [];
    for (let i = 1; i < moviesByProducer.length; i++) {
      const interval = moviesByProducer[i].year - moviesByProducer[i - 1].year;
      intervals[producer].push({
        interval,
        firstWinYear: moviesByProducer[i - 1].year,
        lastWinYear: moviesByProducer[i].year,
      });
    }
  }
  return intervals;
}

const calculateMaxAndMinInterval = (intervals) => {
  let maxInterval = Number.MIN_SAFE_INTEGER;
  let minInterval = Number.MAX_SAFE_INTEGER;
  for (const producer in intervals) {
    const intervalsProducer = intervals[producer].map(item => item.interval);
    if (intervalsProducer.length > 0) {
      const minIntervalProducer = Math.min(...intervalsProducer);
      const maxIntervalProducer = Math.max(...intervalsProducer);
      if (maxIntervalProducer > maxInterval) {
        maxInterval = maxIntervalProducer;
      }
      if (minIntervalProducer < minInterval) {
        minInterval = minIntervalProducer;
      }
    }
  }
  return {
    maxInterval,
    minInterval,
  };
}

const findMinIntervalProducers = (intervals, minInterval) => {
  const minIntervalProducers = [];
  for (const producer in intervals) {
    intervals[producer].forEach(item => {
      if (item.interval === minInterval) {
        minIntervalProducers.push({
          producer,
          ...item,
        });
      }
    });
  }
  return minIntervalProducers;
}

const findMaxIntervalProducers = (intervals, maxInterval) => {
  const maxIntervalProducers = [];
  for (const producer in intervals) {
    intervals[producer].forEach(item => {
      if (item.interval === maxInterval) {
        maxIntervalProducers.push({
          producer,
          ...item,
        });
      }
    });
  }
  return maxIntervalProducers;
}

module.exports = { getMovies };
