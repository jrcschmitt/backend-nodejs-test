const { getMovies } = require('../services/movies.service');

const handleGetMovies = async (req, res) => {
  try {
    const projection = req.query.projection;
    const result = await getMovies(projection);
    return res.json(result).status(200);
  } catch (error) {
    return res
    .status(error.status || 500)
    .send(error.message || 'Something went wrong with getting movies.');
  }
}

module.exports = { handleGetMovies };
