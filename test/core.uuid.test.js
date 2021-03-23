const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    //crypto           = require("crypto"),
    uuid_v4          = require("../src/core.uuid.js").v4,
    RE_uuid          = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    RE_urn_uuid      = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    REPETITIONS      = 100;

describe("uuid_v4", () => {

    test("should generate strings matching uuid pattern", () => {
        expect(typeof uuid_v4).toBe('function');
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid_v4()).toMatch(RE_uuid);
        }
    });

    test("should generate strings that are convertible to a 128-bit buffer", () => {
        for (let i = 0; i < REPETITIONS; i++) {
            const buf = Buffer.from(uuid_v4().replace(/-/g, ""), "hex");
            // 128-bit means, the buffer has to be 16 bytes long
            expect(buf).toHaveLength(16);
        }
    });

    test("should generate strings complying to uuid v4 requirements", () => {
        for (let i = 0; i < REPETITIONS; i++) {
            const buf = Buffer.from(uuid_v4().replace(/-/g, ""), "hex");
            // the four most significant bits of the 7th byte must be '0100'
            expect(buf[6] >>> 4).toBe(0b0100);
            // the two most significant bits of the 9th byte must be '10'
            expect(buf[8] >>> 6).toBe(0b10);
        }
    });

    test("should have a urn sub method to generate prefixed uuids", () => {
        expect(typeof uuid_v4.urn).toBe('function');
        for (let i = 0; i < REPETITIONS; i++) {
            expect(uuid_v4.urn()).toMatch(RE_urn_uuid);
        }
    });

});