const uuid = exports;

uuid.scramble = require('./core.uuid.scramble.js');
uuid.v1       = require('./core.uuid.v1.js');
uuid.v4       = require('./core.uuid.v4.js');

Object.freeze(uuid);