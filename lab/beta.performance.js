const
    crypto        = require('crypto'),
    uuid_old      = require("../src/core.uuid.js")({
        mode:      "local",
        parameter: {crypto}
    }),
    uuid_oneliner = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)),
    uuid_beta_v4  = require('../src/core.uuid.beta.js').v4,
    uuid_npm_v4   = require('uuid').v4;

console.time('v4');
for (let i = 0; i < 1e4; i++) {
    const id = uuid_old();
    //const id = uuid_oneliner();
    //const id = uuid_beta_v4();
    //const id = uuid_npm_v4();
}
console.timeEnd('v4');