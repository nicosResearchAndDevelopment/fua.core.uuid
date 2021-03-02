const
    config          = {
        tests:      100,
        iterations: 10000
    },
    timer           = {
        ts:   [0, 0],
        time: 0,
        start() {
            this.ts = process.hrtime();
        },
        stop() {
            const [sec, nsec] = process.hrtime(this.ts);
            this.time         = sec + 1e-9 * nsec;
        }
    },
    shuffle         = (array) => {
        for (let index = array.length - 1; index > 0; index--) {
            let temp      = array[index],
                random    = Math.floor(Math.random() * index);
            array[index]  = array[random];
            array[random] = temp;
        }
        return array;
    },
    round           = (number, decimals = 0) => {
        const factor = 10 ** decimals;
        return Math.round(number * factor) / factor;
    },
    crypto          = require('crypto'),
    uuid_v4_methods = {
        'static':   () => 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
        'current':  require("../src/core.uuid.js")({
            mode:      "local",
            parameter: {crypto}
        }),
        'oneliner': () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)),
        'beta':     require('../src/core.uuid.beta.js').v4,
        'public':   require('uuid').v4
    },
    test_array      = shuffle((new Array(config.tests)).fill(Object.keys(uuid_v4_methods)).flat(1).map(val => val)),
    results         = Object.fromEntries(Object.keys(uuid_v4_methods).map(key => [key, {
        name:  key,
        times: [],
        value: ''
    }]));

for (let key of test_array) {
    const method = uuid_v4_methods[key],
          result = results[key];
    timer.start();
    for (let i = 0, max = config.iterations; i < max; i++) {
        result.value = method();
    }
    timer.stop();
    result.times.push(timer.time);
}

console.log('average time of ' + config.tests.toLocaleString() + ' tests with ' + config.iterations.toLocaleString() + ' iterations each:');
for (let result of Object.values(results)) {
    const avgTimeSec = result.times.reduce((acc, val) => acc + val, 0) / result.times.length;
    console.log(result.name + ': ' + round(1e3 * avgTimeSec, 2).toLocaleString() + 'ms');
}