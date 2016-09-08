# Unreleased
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
