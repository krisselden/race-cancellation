[race-cancellation](../README.md) > ["noopRaceCancellation"](../modules/_noopracecancellation_.md)

# External module: "noopRaceCancellation"

## Index

### Functions

* [noopRaceCancellation](_noopracecancellation_.md#noopracecancellation)

---

## Functions

<a id="noopracecancellation"></a>

### `<Const>` noopRaceCancellation

▸ **noopRaceCancellation**<`Result`>(task: *[Task](_interfaces_.md#task)<`Result`> \| `PromiseLike`<`Result`>*): `Promise`<`Result`>

*Defined in [noopRaceCancellation.ts:7](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/noopRaceCancellation.ts#L7)*

Allows an async function to add raceCancellation as an optional param in a backwards compatible way by using this as the default.

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type |
| ------ | ------ |
| task | [Task](_interfaces_.md#task)<`Result`> \| `PromiseLike`<`Result`> |

**Returns:** `Promise`<`Result`>

___

