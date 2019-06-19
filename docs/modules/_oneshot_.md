[race-cancellation](../README.md) > ["oneshot"](../modules/_oneshot_.md)

# External module: "oneshot"

## Index

### Functions

* [intoOneshot](_oneshot_.md#intooneshot)
* [isOneshot](_oneshot_.md#isoneshot)
* [oneshot](_oneshot_.md#oneshot)

---

## Functions

<a id="intooneshot"></a>

###  intoOneshot

▸ **intoOneshot**<`Result`>(task: *`function`*): [Oneshot](../interfaces/_internal_.oneshot.md)<`Result`>

*Defined in [oneshot.ts:46](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/oneshot.ts#L46)*

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type |
| ------ | ------ |
| task | `function` |

**Returns:** [Oneshot](../interfaces/_internal_.oneshot.md)<`Result`>

___
<a id="isoneshot"></a>

###  isOneshot

▸ **isOneshot**<`Result`>(task: *`function`*): `boolean`

*Defined in [oneshot.ts:40](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/oneshot.ts#L40)*

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type |
| ------ | ------ |
| task | `function` |

**Returns:** `boolean`

___
<a id="oneshot"></a>

###  oneshot

▸ **oneshot**<`Result`>(): [`function`, [Complete](_interfaces_.md#complete)<`Result`>]

*Defined in [oneshot.ts:9](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/oneshot.ts#L9)*

Creates a tuple of a function to lazily build a promise of a one time event and a method to complete the promise.

**Type parameters:**

#### Result 

**Returns:** [`function`, [Complete](_interfaces_.md#complete)<`Result`>]

___

