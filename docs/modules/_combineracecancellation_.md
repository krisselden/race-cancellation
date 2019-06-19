[race-cancellation](../README.md) > ["combineRaceCancellation"](../modules/_combineracecancellation_.md)

# External module: "combineRaceCancellation"

## Index

### Functions

* [combineRaceCancellation](_combineracecancellation_.md#combineracecancellation)

---

## Functions

<a id="combineracecancellation"></a>

###  combineRaceCancellation

▸ **combineRaceCancellation**(a: *[RaceCancellation](_interfaces_.md#racecancellation) \| `undefined`*, b: *[RaceCancellation](_interfaces_.md#racecancellation) \| `undefined`*): [RaceCancellation](_interfaces_.md#racecancellation)

*Defined in [combineRaceCancellation.ts:12](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/combineRaceCancellation.ts#L12)*

Returns a RaceCancellation that is the combination of two RaceCancellation implemenations.

For convenience of writing methods that take cancellations, the params are optional. If a is undefined, then b is retuned, if b is undefined then a is returned, and if they both are undefined a noop race that just invokes the task is returned.

**Parameters:**

| Name | Type |
| ------ | ------ |
| a | [RaceCancellation](_interfaces_.md#racecancellation) \| `undefined` |
| b | [RaceCancellation](_interfaces_.md#racecancellation) \| `undefined` |

**Returns:** [RaceCancellation](_interfaces_.md#racecancellation)

___

