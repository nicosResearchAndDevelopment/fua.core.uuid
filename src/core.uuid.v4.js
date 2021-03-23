const
    _ = require('./core.uuid.util.js');

/** @see {@link https://github.com/uuidjs/uuid/blob/master/src/v4.js uuid-js / v4.js} */
function uuid_v4() {
    const bytes = _.randomBytes(16);

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    return _.bytesToUUID(bytes);
} // uuid_v4

uuid_v4.urn = function () {
    return 'urn:uuid:' + uuid_v4();
};

_.lockProp(uuid_v4, 'urn');

module.exports = uuid_v4;