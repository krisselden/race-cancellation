[race-cancellation](../README.md) > ["throwIfCancelled"](../modules/_throwifcancelled_.md)

# External module: "throwIfCancelled"

## Index

### Functions

* [throwIfCancelled](_throwifcancelled_.md#throwifcancelled)

---

## Functions

<a id="throwifcancelled"></a>

###  throwIfCancelled

▸ **throwIfCancelled**<`Result`>(result: *`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)*): `Result`

*Defined in [throwIfCancelled.ts:8](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/throwIfCancelled.ts#L8)*

Throw if the `result` is a `Cancellation` otherwise return it.

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| result | `Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md) |  the result of a cancellable task. |

**Returns:** `Result`

___

