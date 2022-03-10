//importing winston module
const winston = require('winston');
// importing express package
const express = require('express');
// initiating express app
const app = express();

app.set("view options", {layout: false});
app.use(express.static(__dirname + '/public'));

require('./startup/validation')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();

// defining the port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;