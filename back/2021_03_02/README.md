# fua.core.uuid

## Performance

__Average time of 100 tests with 10.000 iterations each:__
- _static:_ 0,13ms
- _current:_ 921,85ms
- _oneliner:_ 910ms
- _beta:_ 31,77ms
- _public:_ 12,56ms

This means, the [publicly available implementation](https://www.npmjs.com/package/uuid) of UUIDs
is more than __70 times faster__ than the current implementation! The main reason for this is the use of
`crypto.randomBytes` with a length of _1_, which is very inefficient. Filling a buffer with random bytes
is much faster. The UUID implementation from NPM is also faster, because it buffers a 256 byte long random
UInt8Array to reduce the times it has to call `crypto.randomFillSync` again.