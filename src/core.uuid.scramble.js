const
    _ = require('./core.uuid.util.js');

function uuid_scramble(length) {
    const bytes = _.randomBytes(length);
    return bytes.toString('ascii');
} // uuid_scramble

module.exports = uuid_scramble;