[race-cancellation](../README.md) > ["disposablePromise"](../modules/_disposablepromise_.md)

# External module: "disposablePromise"

## Index

### Functions

* [disposablePromise](_disposablepromise_.md#disposablepromise)

---

## Functions

<a id="disposablepromise"></a>

###  disposablePromise

▸ **disposablePromise**<`Result`>(executor: *[Executor](_interfaces_.md#executor)<`Result`>*, raceCancellation?: *`function`*): `Promise`<[Cancellation](../interfaces/_interfaces_.cancellation.md)<`string`> \| `Result`>

*Defined in [disposablePromise.ts:4](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/disposablePromise.ts#L4)*

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| executor | [Executor](_interfaces_.md#executor)<`Result`> | - |
| `Default value` raceCancellation | `function` |  noop |

**Returns:** `Promise`<[Cancellation](../interfaces/_interfaces_.cancellation.md)<`string`> \| `Result`>

___

