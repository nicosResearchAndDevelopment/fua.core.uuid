const
    _                = require('./core.uuid.util.js'),
    GREGORIAN_OFFSET = 12219292800000;

let
    _nodeId    = _.emptyBytes(6),
    _clockSeq  = 0,
    _lastMSecs = 0,
    _lastNSecs = 0;

(() => {
    const seedBytes = _.randomBytes(8);
    _nodeId[0]      = seedBytes[0] | 0x01;
    _nodeId[1]      = seedBytes[1];
    _nodeId[2]      = seedBytes[2];
    _nodeId[3]      = seedBytes[3];
    _nodeId[4]      = seedBytes[4];
    _nodeId[5]      = seedBytes[5];
    _clockSeq       = ((seedBytes[6] << 8) | seedBytes[7]) & 0x3fff;
})(); // seed_uuid_v1

/**
 * @returns {string}
 * @see {@link https://github.com/uuidjs/uuid/blob/master/src/v1.js uuid-js / v1.js}
 */
function uuid_v1() {
    const bytes = _.emptyBytes(16);

    let
        node     = _nodeId,
        clockSeq = _clockSeq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'mSecs' (integer milliseconds) and 'nSecs'
    // (100-nanoseconds offset from mSecs) since unix epoch, 1970-01-01 00:00.
    let mSecs = Date.now();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    let nSecs = _lastNSecs + 1;

    // Time since last uuid creation (in mSecs)
    const dt = mSecs - _lastMSecs + (nSecs - _lastNSecs) / 10000;

    // Per 4.2.1.2, Bump clockSeq on clock regression
    if (dt < 0) {
        clockSeq = (clockSeq + 1) & 0x3fff;
    }

    // Reset nSecs if clock regresses (new clockSeq) or we've moved onto a new
    // time interval
    if (dt < 0 || mSecs > _lastMSecs) {
        nSecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nSecs >= 10000) {
        throw new Error("uuid.v1 cannot create more than 10M uuids/sec");
    }

    _lastMSecs = mSecs;
    _lastNSecs = nSecs;
    _clockSeq  = clockSeq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    mSecs += 12219292800000;

    // `time_low`
    const tl = ((mSecs & 0xfffffff) * 10000 + nSecs) % 0x100000000;
    bytes[0] = (tl >>> 24) & 0xff;
    bytes[1] = (tl >>> 16) & 0xff;
    bytes[2] = (tl >>> 8) & 0xff;
    bytes[3] = tl & 0xff;

    // `time_mid`
    const tmh = ((mSecs / 0x100000000) * 10000) & 0xfffffff;
    bytes[4]  = (tmh >>> 8) & 0xff;
    bytes[5]  = tmh & 0xff;

    // `time_high_and_version`
    bytes[6] = ((tmh >>> 24) & 0xf) | 0x10; // include version
    bytes[7] = (tmh >>> 16) & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    bytes[8] = (clockSeq >>> 8) | 0x80;

    // `clock_seq_low`
    bytes[9] = clockSeq & 0xff;

    // `node`
    bytes[10] = node[0];
    bytes[11] = node[1];
    bytes[12] = node[2];
    bytes[13] = node[3];
    bytes[14] = node[4];
    bytes[15] = node[5];

    return _.bytesToUUID(bytes);
} // uuid_v1

/**
 * @returns {string}
 */
uuid_v1.urn = function () {
    return 'urn:uuid:' + uuid_v1();
};

_.lockProp(uuid_v1, 'urn');

/**
 * @param {string} value
 * @returns {boolean}
 */
uuid_v1.valid = function (value) {
    const bytes = _.uuidToBytes(value);
    // return bytes && (bytes[6] >>> 4) === 0b0001 && (bytes[8] >>> 6) === 0b10;
    return bytes && (bytes[6] >>> 4) === 0b0001;
};

_.lockProp(uuid_v1, 'valid');

/**
 * @param {string} value
 * @returns {Date}
 */
uuid_v1.date = function (value) {
    const bytes = _.uuidToBytes(value);
    // if (!(bytes && (bytes[6] >>> 4) === 0b0001 && (bytes[8] >>> 6) === 0b10))
    if (!(bytes && (bytes[6] >>> 4) === 0b0001))
        return new Date(NaN);
    // extract time low
    const tl    = ((
        ((
            ((
                ((
                    bytes[0]
                ) << 8) | bytes[1]
            ) << 8) | bytes[2]
        ) << 8) | bytes[3]
    ) + 0x100000000) % 0x100000000;
    // extract time mid and high
    const tmh   = ((
        ((
            ((
                bytes[6] & 0x0f
            ) << 8) | bytes[7]
        ) << 8) | bytes[4]
    ) << 8) | bytes[5];
    // calculate milliseconds from time low, mid and high and convert from Gregorian epoch to unix epoch
    const mSecs = ((tmh / 10000) * 0x100000000) + (tl / 10000) - 12219292800000;
    return new Date(mSecs);
};

module.exports = uuid_v1;
