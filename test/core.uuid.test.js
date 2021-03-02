const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    //crypto           = require("crypto"),
    //uuid             = require("../src/core.uuid.js")({
    //    mode:      "local",
    //    parameter: {crypto}
    //}),
    uuid             = require("../src/core.uuid.js").v4,
    RE_uuid          = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("a uuid should always", () => {
    const repetitions = 100;

    test("have a valid uuid pattern", () => {
        for (let i = 0; i < repetitions; i++) {
            expect(uuid()).toMatch(RE_uuid);
            // expect(uuid({ type: "scramble" })).toMatch(RE_uuid);
            // expect(uuid({ type: "default" })).toMatch(RE_uuid);
        }
    });

    test("be convertable to a 128-bit buffer", () => {
        for (let i = 0; i < repetitions; i++) {
            const buf = Buffer.from(uuid().replace(/-/g, ""), "hex");
            // 128-bit means, the buffer has to be 16 bytes long
            expect(buf).toHaveLength(16);
        }
    });

    test("comply to uuid v4 requirements", () => {
        for (let i = 0; i < repetitions; i++) {
            const buf = Buffer.from(uuid().replace(/-/g, ""), "hex");
            // the four most significant bits of the 7th byte must be '0100'
            expect(buf[6] >>> 4).toBe(0b0100);
            // the two most significant bits of the 9th byte must be '10'
            expect(buf[8] >>> 6).toBe(0b10);
        }
    });

});