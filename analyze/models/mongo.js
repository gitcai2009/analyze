const mongoose = require('mongoose');
const config = require('../config/default');

mongoose.connect(config.mongodb);

require('./machine');
require('./users');
require('./place');
require('./sale');

exports.User = mongoose.model('user');
exports.Sale = mongoose.model('sale');
exports.Place = mongoose.model('place');
exports.Machine = mongoose.model('machine');