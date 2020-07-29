const
    crypto = require("crypto"),
    uuid = require("../src/core.uuid.js")({
        mode: "local",
        parameter: { crypto }
    }),
    RE_uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("uuid should always", () => {

    test("return a valid uuid pattern", () => {
        for (let i = 0; i < 100; i++) {
            expect(uuid()).toMatch(RE_uuid);
        }
    });

});