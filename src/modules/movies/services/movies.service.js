const db = require('../../../database');

const getMovies = async (projection) => {
  const movies = db.getCollection('movies');

  if (projection) {
    if (projection === 'max-min-win-interval-for-producers') {
      const winnerMovies = movies.find({winner: true});
      const {
        intervals,
        firstLastYears,
      } = calculateYearsIntervalsByProducers(
        groupMoviesByProducer(winnerMovies));
      const {
        minInterval,
        maxInterval,
        minIntervalProducer,
        maxIntervalProducer,
      } = calculateMaxAndMinInterval(intervals);
      return {
        min: [
          {
            producer: minIntervalProducer,
            interval: minInterval,
            previousWin: firstLastYears[minIntervalProducer].firstWinYear,
            followingWin: firstLastYears[minIntervalProducer].lastWinYear,
          }
        ],
        max: [
          {
            producer: maxIntervalProducer,
            interval: maxInterval,
            previousWin: firstLastYears[maxIntervalProducer].firstWinYear,
            followingWin: firstLastYears[maxIntervalProducer].lastWinYear,
          }
        ],
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
  const firstLastYears = {};
  for (const producer in groupedByProducer) {
    const moviesByProducer = groupedByProducer[producer];
    moviesByProducer.sort((a, b) => a.year - b.year);
    intervals[producer] = [];
    for (let i = 1; i < moviesByProducer.length; i++) {
      const interval = moviesByProducer[i].year - moviesByProducer[i - 1].year;
      intervals[producer].push(interval);
    }
    firstLastYears[producer] = {
      firstWinYear: moviesByProducer[0].year,
      lastWinYear: moviesByProducer[moviesByProducer.length - 1].year
    };
  }
  return {
    intervals,
    firstLastYears,
  };
}

const calculateMaxAndMinInterval = (intervals) => {
  let maxIntervalProducer, minIntervalProducer;
  let maxInterval = Number.MIN_SAFE_INTEGER;
  let minInterval = Number.MAX_SAFE_INTEGER;
  for (const producer in intervals) {
    const avgInterval = intervals[producer]
      .reduce((acc, val) => acc + val, 0) / intervals[producer].length;
    if (avgInterval > maxInterval) {
      maxInterval = avgInterval;
      maxIntervalProducer = producer;
    }
    if (avgInterval < minInterval) {
      minInterval = avgInterval;
      minIntervalProducer = producer;
    }
  }
  return {
    maxInterval,
    minInterval,
    maxIntervalProducer,
    minIntervalProducer,
  };
}

module.exports = { getMovies };
