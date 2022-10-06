const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    //crypto           = require('crypto'),
    uuid             = require('../src/core.uuid.js'),
    RE_uuid          = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    RE_urn_uuid      = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    REPETITIONS      = 100;

describe('uuid.v1', function () {

    test('develop', function () {
        const
            now     = new Date(),
            uuidNow = uuid.v1.toDate(uuid.v1());

        console.log(now);
        console.log(uuidNow);
    });

});

describe('uuid.v4', function () {

    test('should generate strings matching uuid pattern', function () {
        expect(typeof uuid.v4).toBe('function');
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid.v4()).toMatch(RE_uuid);
        }
    });

    test('should generate strings that are convertible to a 128-bit buffer', function () {
        for (let i = 0; i < REPETITIONS; i++) {
            const buf = Buffer.from(uuid.v4().replace(/-/g, ""), 'hex');
            // 128-bit means, the buffer has to be 16 bytes long
            expect(buf).toHaveLength(16);
        }
    });

    test('should generate strings complying to uuid v4 requirements', function () {
        for (let i = 0; i < REPETITIONS; i++) {
            const buf = Buffer.from(uuid.v4().replace(/-/g, ""), 'hex');
            // the four most significant bits of the 7th byte must be '0100'
            expect(buf[6] >>> 4).toBe(0b0100);
            // the two most significant bits of the 9th byte must be '10'
            expect(buf[8] >>> 6).toBe(0b10);
        }
    });

    test('should validate its own generated uuids', function () {
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid.v4.isValid(uuid.v4())).toBeTruthy();
        }
    });

    test('should have a urn sub method to generate prefixed uuids', function () {
        expect(typeof uuid.v4.urn).toBe('function');
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid.v4.urn()).toMatch(RE_urn_uuid);
        }
    });

});

describe('uuid.detect', function () {

    test('should detect uuid.v1', function () {
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid.detect(uuid.v1())).toMatchObject({
                valid:   true,
                urn:     false,
                version: 1,
                variant: 1
            });
        }
    });

    test('should detect uuid.v1.urn', function () {
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid.detect(uuid.v1.urn())).toMatchObject({
                valid:   true,
                urn:     true,
                version: 1,
                variant: 1
            });
        }
    });

    test('should detect uuid.v4', function () {
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid.detect(uuid.v4())).toMatchObject({
                valid:   true,
                urn:     false,
                version: 4,
                variant: 1
            });
        }
    });

    test('should detect uuid.v4.urn', function () {
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid.detect(uuid.v4.urn())).toMatchObject({
                valid:   true,
                urn:     true,
                version: 4,
                variant: 1
            });
        }
    });

});
