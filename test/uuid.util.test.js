const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    _                = require('../src/core.uuid.util.js');

describe('uuid.util', () => {

    test('develop', () => {
        const
            bytes  = _.randomBytes(16),
            uuid   = _.bytesToUUID(bytes),
            bytes2 = _.uuidToBytes(uuid),
            uuid2  = _.bytesToUUID(bytes2);

        expect(bytes).toMatchObject(bytes2);
        expect(uuid).toBe(uuid2);
    });

});
