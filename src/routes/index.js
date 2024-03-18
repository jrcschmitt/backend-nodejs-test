const { Router } = require('express');
const moviesRouter = require('./movies.routes');

const routes = Router();

routes.use('/api/movies', moviesRouter);

module.exports = routes;
