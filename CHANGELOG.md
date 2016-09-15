# v1.0.0
## Features
- es6 support and node engine changed to 6.x
- promise response if callback is not provided as an argument #20
- option to set validated = true to generate mocks for already parsed api #24
- parameter override at operation level #25

## Bugfixes
- exclusive limit issue #27 and multipleOf max value enhancement #26
- mock gen issue for type number with minimum =0 #28

# v0.0.4
## Features
- #11 support additional format options as per json schema (uri, hostname, ipv4, ipv6)

## Bugfixes
- Fix the `maxItems` bug and add additional test cases - #16
- Fix the issue - enum of type integer is not handled properly #21
- Fix the issue - if example is wrong the mock generated is not as per schema #23

# v0.0.3

## Bugfixes and features

- #1 Support parameters defined for all the operations
- #2 support `multipleOf` property
- #3 Support for pattern
- Use only alpha characters for the string mock
- If `type` is missing try to find the type. default to `object`
