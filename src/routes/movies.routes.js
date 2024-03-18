const { Router } = require('express');
const { handleGetMovies } = require('../modules/movies/controllers/movies.controller');

const moviesRouter = Router();

moviesRouter.get('/', handleGetMovies);

module.exports = moviesRouter;
