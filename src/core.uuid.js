const
    uuid = exports,
    _    = require('./core.uuid.util.js');

uuid.v1 = require('./core.uuid.v1.js');
uuid.v4 = require('./core.uuid.v4.js');

/**
 * @param {string} value
 * @returns {{value: any, valid: boolean, version?: number, variant?: number, urn?: boolean}}
 */
uuid.detect = function (value) {
    const result = {value, valid: false};
    if (typeof value !== 'string') return result;

    result.urn  = value.startsWith('urn:uuid:');
    const bytes = _.uuidToBytes(result.urn ? value.substring(9) : value);
    if (!bytes) return result;

    result.version = (bytes[6] >>> 4);
    result.variant = (bytes[8] >>> 7) === 0b0 ? 0
        : (bytes[8] >>> 6) === 0b10 ? 1
            : (bytes[8] >>> 5) === 0b110 ? 2
                : (bytes[8] >>> 5) === 0b111 ? 3
                    : -1;

    result.valid = result.version >= 1 && result.version <= 5 && result.variant >= 0;
    return result;
}; // uuid.detect

/**
 * @param {number} [length=16]
 * @returns {string}
 */
uuid.scramble = function (length = 16) {
    const bytes = _.randomBytes(length);
    return bytes.toString('base64url');
} // uuid.scramble

_.lockAllProp(uuid, Infinity);
module.exports = uuid;
