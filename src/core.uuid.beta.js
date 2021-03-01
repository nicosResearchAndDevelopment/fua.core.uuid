const
    uuid      = exports,
    crypto    = require('crypto'),
    byteToHex = Object.freeze((new Array(256)).fill(0).map(
        (value, index) => (index + 0x100).toString(16).substr(1)
    ));

// https://github.com/uuidjs/uuid/blob/master/src/v4.js
uuid.v4 = function () {
    const rnds = new Uint8Array(16);
    crypto.randomFillSync(rnds);

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    return byteToHex[rnds[0]] + byteToHex[rnds[1]] +
        byteToHex[rnds[2]] + byteToHex[rnds[3]] +
        '-' + byteToHex[rnds[4]] + byteToHex[rnds[5]] +
        '-' + byteToHex[rnds[6]] + byteToHex[rnds[7]] +
        '-' + byteToHex[rnds[8]] + byteToHex[rnds[9]] +
        '-' + byteToHex[rnds[10]] + byteToHex[rnds[11]] +
        byteToHex[rnds[12]] + byteToHex[rnds[13]] +
        byteToHex[rnds[14]] + byteToHex[rnds[15]];
}; // uuid.v4

uuid.prev_v4 = function () {
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16));
}; // uuid.prev_v4