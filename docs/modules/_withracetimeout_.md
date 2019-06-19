[race-cancellation](../README.md) > ["withRaceTimeout"](../modules/_withracetimeout_.md)

# External module: "withRaceTimeout"

## Index

### Functions

* [withRaceTimeout](_withracetimeout_.md#withracetimeout)

---

## Functions

<a id="withracetimeout"></a>

###  withRaceTimeout

▸ **withRaceTimeout**<`Result`>(task: *[CancellableTask](_interfaces_.md#cancellabletask)<`Result`>*, milliseconds: *`number`*, message?: *`undefined` \| `string`*, newTimeout?: *[NewTimeout](_interfaces_.md#newtimeout)*): [OptionallyCancellableTask](_interfaces_.md#optionallycancellabletask)<`Result`>

*Defined in [withRaceTimeout.ts:26](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/withRaceTimeout.ts#L26)*

Wrap a cancellable task with a timeout.

```js
async function fetchWithTimeout(url, timeoutMs, raceCancellation) {
  return await withRaceTimeout(raceTimeout => {
     return await cancellableFetch(url, raceTimeout));
  }, timeoutMs)(raceCancellation);
}
```

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| task | [CancellableTask](_interfaces_.md#cancellabletask)<`Result`> |  a cancellable task |
| milliseconds | `number` |  timeout in miliseconds |
| `Optional` message | `undefined` \| `string` |  optional cancellation message |
| `Optional` newTimeout | [NewTimeout](_interfaces_.md#newtimeout) |  optional implementation of timeout creation for testing |

**Returns:** [OptionallyCancellableTask](_interfaces_.md#optionallycancellabletask)<`Result`>

___

