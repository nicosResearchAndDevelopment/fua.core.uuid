const
    util         = exports,
    crypto       = require('crypto'),
    _byteToHex   = Object.freeze((new Array(256)).fill(0).map(
        (value, index) => (index + 0x100).toString(16).substring(1)
    )),
    _uuidMatcher = /^([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})$/i;

util.sealModule = function (target) {
    Object.freeze(target);
    for (const child of Object.values(target)) {
        if (child instanceof Object) util.sealModule(child);
    }
};

util.bytesToUUID = function (bytes) {
    return _byteToHex[bytes[0]] + _byteToHex[bytes[1]] +
        _byteToHex[bytes[2]] + _byteToHex[bytes[3]] +
        '-' + _byteToHex[bytes[4]] + _byteToHex[bytes[5]] +
        '-' + _byteToHex[bytes[6]] + _byteToHex[bytes[7]] +
        '-' + _byteToHex[bytes[8]] + _byteToHex[bytes[9]] +
        '-' + _byteToHex[bytes[10]] + _byteToHex[bytes[11]] +
        _byteToHex[bytes[12]] + _byteToHex[bytes[13]] +
        _byteToHex[bytes[14]] + _byteToHex[bytes[15]];
};

util.uuidToBytes = function (uuid) {
    const match = _uuidMatcher.exec(uuid);
    if (match) return Buffer.from(match[1] + match[2] + match[3] + match[4] + match[5], 'hex');
};

util.emptyBytes = function (length) {
    return Buffer.alloc(length);
};

let _poolPtr     = 0, _rndBytePool = crypto.randomBytes(1024);
util.randomBytes = function (length) {
    if (_poolPtr + length > _rndBytePool.length) {
        if (length > _rndBytePool.length) {
            return crypto.randomBytes(length);
        } else {
            crypto.randomFillSync(_rndBytePool, 0, _poolPtr);
            _poolPtr = 0;
        }
    }
    return Uint8Array.prototype.slice.call(_rndBytePool, _poolPtr, _poolPtr += length);
};
