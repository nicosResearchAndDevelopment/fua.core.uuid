# fua.core.uuid

- [A Universally Unique IDentifier (UUID) URN Namespace](https://tools.ietf.org/html/rfc4122)

The formal definition of the UUID string representation 
is provided by the following [ABNF](https://tools.ietf.org/html/rfc2234):

```
UUID                   = time-low "-" time-mid "-"
                         time-high-and-version "-"
                         clock-seq-and-reserved
                         clock-seq-low "-" node
time-low               = 4hexOctet
time-mid               = 2hexOctet
time-high-and-version  = 2hexOctet
clock-seq-and-reserved = hexOctet
clock-seq-low          = hexOctet
node                   = 6hexOctet
hexOctet               = hexDigit hexDigit
hexDigit               = "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
                         "a" / "b" / "c" / "d" / "e" / "f" /
                         "A" / "B" / "C" / "D" / "E" / "F"
```

## Version 4: UUID from truly-random or pseudo-random numbers

The algorithm is as follows:

- Set the two most significant bits (__bits 6 and 7__) of the
  clock_seq_hi_and_reserved to __0 and 1__, respectively.
- Set the four most significant bits (__bits 12 through 15__) of the
  time_hi_and_version field to the 4-bit version number __0 1 0 0__.
- Set all the other bits to randomly (or pseudo-randomly) chosen values.

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