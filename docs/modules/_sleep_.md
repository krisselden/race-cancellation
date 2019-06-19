[race-cancellation](../README.md) > ["sleep"](../modules/_sleep_.md)

# External module: "sleep"

## Index

### Functions

* [sleep](_sleep_.md#sleep)

---

## Functions

<a id="sleep"></a>

###  sleep

▸ **sleep**(milliseconds: *`number`*, raceCancellation?: *`function`*, newTimeout?: *`function`*): `Promise`<`void` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

*Defined in [sleep.ts:22](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/sleep.ts#L22)*

Cancellable promise of a timeout.

If the cancellation wins the race the timeout will cleanup (allowing node to exit for example).

```js
await sleep(1000, raceCancellation);
```

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| milliseconds | `number` | - |  timeout in milliseconds |
| `Default value` raceCancellation | `function` |  noopRaceCancellation |  a function to race the timeout promise against a cancellation. |
| `Default value` newTimeout | `function` |  newTimeoutDefault |  defaults to setTimeout/clearTimeout allows you to provide other implementation for testing |

**Returns:** `Promise`<`void` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

___

