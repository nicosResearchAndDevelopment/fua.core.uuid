const
    _            = exports,
    crypto       = require('crypto'),
    _byteToHex   = Object.freeze((new Array(256)).fill(0).map(
        (value, index) => (index + 0x100).toString(16).substring(1)
    )),
    _uuidMatcher = /^([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})$/i;

_.lockProp = function (obj, ...keys) {
    const lock = {writable: false, configurable: false};
    for (let key of keys) {
        const writable = !Object.prototype.hasOwnProperty.call(obj, key) || Reflect.getOwnPropertyDescriptor(obj, key).configurable;
        if (writable) Object.defineProperty(obj, key, lock);
    }
    return _;
};

_.lockAllProp = function (obj, depth = 0) {
    const lock = {writable: false, configurable: false};
    for (let [key, value] of Object.entries(obj)) {
        const writable = !Object.prototype.hasOwnProperty.call(obj, key) || Reflect.getOwnPropertyDescriptor(obj, key).configurable;
        if (writable) {
            Object.defineProperty(obj, key, lock);
            if (depth > 0 && value instanceof Object)
                _.lockAllProp(value, depth - 1);
        }
    }
    return _;
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

_.uuidToBytes = function (uuid) {
    const match = _uuidMatcher.exec(uuid);
    if (match) return Buffer.from(match[1] + match[2] + match[3] + match[4] + match[5], 'hex');
};

_.emptyBytes = function (length) {
    // REM: a buffer is basically the same as an Uint8Array
    //return new Uint8Array(length);
    return Buffer.alloc(length);
};

function _sliceBytes(buffer, from, to) {
    // REM: Buffer#slice points to the same memory, instead use Uint8Array#slice to copy the buffer
    //return _rndBytePool.slice(_poolPtr, _poolPtr += length);
    return Uint8Array.prototype.slice.call(buffer, from, to);
}

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
    return _sliceBytes(_rndBytePool, _poolPtr, _poolPtr += length);
};
