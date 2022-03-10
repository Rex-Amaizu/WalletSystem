const express = require('express');
const transfer = require('../routes/transfer');
const wallets = require('../routes/wallets');
const users = require('../routes/users');
const login = require('../routes/login');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/login', login);
    app.use('/api/wallets', wallets);
    app.use('/api/transfer', transfer);

    app.use(error);
}