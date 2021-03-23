const
    _          = exports,
    crypto     = require('crypto'),
    _byteToHex = Object.freeze((new Array(256)).fill(0).map(
        (value, index) => (index + 0x100).toString(16).substr(1)
    ));

_.lockProp = function (obj, ...keys) {
    const lock = {writable: false, configurable: false};
    for (let key of keys) {
        Object.defineProperty(obj, key, lock);
    }
};

_.bytesToUUID = function (bytes) {
    return _byteToHex[bytes[0]] + _byteToHex[bytes[1]] +
        _byteToHex[bytes[2]] + _byteToHex[bytes[3]] +
        '-' + _byteToHex[bytes[4]] + _byteToHex[bytes[5]] +
        '-' + _byteToHex[bytes[6]] + _byteToHex[bytes[7]] +
        '-' + _byteToHex[bytes[8]] + _byteToHex[bytes[9]] +
        '-' + _byteToHex[bytes[10]] + _byteToHex[bytes[11]] +
        _byteToHex[bytes[12]] + _byteToHex[bytes[13]] +
        _byteToHex[bytes[14]] + _byteToHex[bytes[15]];
};

_.emptyBytes = function (length) {
    // REM: a buffer is basically the same as an Uint8Array
    //return new Uint8Array(length);
    return Buffer.alloc(length);
};

let _poolPtr  = 0, _rndBytePool = crypto.randomBytes(1024);
_.randomBytes = function (length) {
    if (_poolPtr + length > _rndBytePool.length) {
        if (length > _rndBytePool.length) {
            return crypto.randomBytes(length);
        } else {
            crypto.randomFillSync(_rndBytePool, 0, _poolPtr);
            _poolPtr = 0;
        }
    }
    // REM: Buffer#slice points to the same memory, instead use Uint8Array#slice to copy the buffer
    //return _rndBytePool.slice(_poolPtr, _poolPtr += length);
    return Uint8Array.prototype.slice.call(_rndBytePool, _poolPtr, _poolPtr += length);
};