const express = require('express');
const app = express();
const port = 3000;

require('./database/index.js');

const routes = require('./routes');

app.use(routes);

app.listen(port, () => {
  console.log('server is running on port', port);
});
