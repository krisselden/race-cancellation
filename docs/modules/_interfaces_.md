[race-cancellation](../README.md) > ["interfaces"](../modules/_interfaces_.md)

# External module: "interfaces"

## Index

### Enumerations

* [CancellationKind](../enums/_interfaces_.cancellationkind.md)

### Interfaces

* [Cancellation](../interfaces/_interfaces_.cancellation.md)

### Type aliases

* [Cancel](_interfaces_.md#cancel)
* [CancellableRace](_interfaces_.md#cancellablerace)
* [CancellableTask](_interfaces_.md#cancellabletask)
* [Complete](_interfaces_.md#complete)
* [Dispose](_interfaces_.md#dispose)
* [Executor](_interfaces_.md#executor)
* [NewCancellation](_interfaces_.md#newcancellation)
* [NewTimeout](_interfaces_.md#newtimeout)
* [NewTimeoutCancellation](_interfaces_.md#newtimeoutcancellation)
* [OptionallyCancellableTask](_interfaces_.md#optionallycancellabletask)
* [RaceCancellation](_interfaces_.md#racecancellation)
* [Task](_interfaces_.md#task)

### Variables

* [cancellationBrand](_interfaces_.md#cancellationbrand)

---

## Type aliases

<a id="cancel"></a>

###  Cancel

**Ƭ Cancel**: *`function`*

*Defined in [interfaces.ts:54](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L54)*

#### Type declaration
▸(message?: *`undefined` \| `string`*, kind?: *`undefined` \| `string`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` message | `undefined` \| `string` |
| `Optional` kind | `undefined` \| `string` |

**Returns:** `void`

___
<a id="cancellablerace"></a>

###  CancellableRace

**Ƭ CancellableRace**: *[[RaceCancellation](_interfaces_.md#racecancellation), [Cancel](_interfaces_.md#cancel)]*

*Defined in [interfaces.ts:56](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L56)*

___
<a id="cancellabletask"></a>

###  CancellableTask

**Ƭ CancellableTask**: *`function`*

*Defined in [interfaces.ts:46](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L46)*

#### Type declaration
▸(raceCancellation: *[RaceCancellation](_interfaces_.md#racecancellation)*): `Promise`<`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

**Parameters:**

| Name | Type |
| ------ | ------ |
| raceCancellation | [RaceCancellation](_interfaces_.md#racecancellation) |

**Returns:** `Promise`<`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

___
<a id="complete"></a>

###  Complete

**Ƭ Complete**: *`function`*

*Defined in [interfaces.ts:36](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L36)*

#### Type declaration
▸(result: *`Result`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| result | `Result` |

**Returns:** `void`

___
<a id="dispose"></a>

###  Dispose

**Ƭ Dispose**: *`function`*

*Defined in [interfaces.ts:63](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L63)*

#### Type declaration
▸(): `void`

**Returns:** `void`

___
<a id="executor"></a>

###  Executor

**Ƭ Executor**: *`function`*

*Defined in [interfaces.ts:58](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L58)*

#### Type declaration
▸(resolve: *`function`*, reject: *`function`*): [Dispose](_interfaces_.md#dispose)

**Parameters:**

| Name | Type |
| ------ | ------ |
| resolve | `function` |
| reject | `function` |

**Returns:** [Dispose](_interfaces_.md#dispose)

___
<a id="newcancellation"></a>

###  NewCancellation

**Ƭ NewCancellation**: *`function`*

*Defined in [interfaces.ts:42](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L42)*

#### Type declaration
▸(): [Cancellation](../interfaces/_interfaces_.cancellation.md)

**Returns:** [Cancellation](../interfaces/_interfaces_.cancellation.md)

___
<a id="newtimeout"></a>

###  NewTimeout

**Ƭ NewTimeout**: *`function`*

*Defined in [interfaces.ts:65](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L65)*

#### Type declaration
▸(callback: *`function`*, ms: *`number`*): [Dispose](_interfaces_.md#dispose)

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |
| ms | `number` |

**Returns:** [Dispose](_interfaces_.md#dispose)

___
<a id="newtimeoutcancellation"></a>

###  NewTimeoutCancellation

**Ƭ NewTimeoutCancellation**: *`function`*

*Defined in [interfaces.ts:67](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L67)*

#### Type declaration
▸(): [Cancellation](../interfaces/_interfaces_.cancellation.md)<[Timeout](../enums/_interfaces_.cancellationkind.md#timeout)>

**Returns:** [Cancellation](../interfaces/_interfaces_.cancellation.md)<[Timeout](../enums/_interfaces_.cancellationkind.md#timeout)>

___
<a id="optionallycancellabletask"></a>

###  OptionallyCancellableTask

**Ƭ OptionallyCancellableTask**: *`function`*

*Defined in [interfaces.ts:50](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L50)*

#### Type declaration
▸(raceCancellation?: *[RaceCancellation](_interfaces_.md#racecancellation)*): `Promise`<`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` raceCancellation | [RaceCancellation](_interfaces_.md#racecancellation) |

**Returns:** `Promise`<`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

___
<a id="racecancellation"></a>

###  RaceCancellation

**Ƭ RaceCancellation**: *`function`*

*Defined in [interfaces.ts:38](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L38)*

#### Type declaration
▸<`Result`>(task: *[Task](_interfaces_.md#task)<`Result`> \| `PromiseLike`<`Result`>*): `Promise`<`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type |
| ------ | ------ |
| task | [Task](_interfaces_.md#task)<`Result`> \| `PromiseLike`<`Result`> |

**Returns:** `Promise`<`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

___
<a id="task"></a>

###  Task

**Ƭ Task**: *`function`*

*Defined in [interfaces.ts:44](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L44)*

#### Type declaration
▸(): `PromiseLike`<`Result`>

**Returns:** `PromiseLike`<`Result`>

___

## Variables

<a id="cancellationbrand"></a>

### `<Const>` cancellationBrand

**● cancellationBrand**: *`unique symbol`* =  Symbol.for("isCancellation")

*Defined in [interfaces.ts:10](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L10)*

A symbol that brands a Cancellation.

This symbol is a runtime registered symbol so that if multiple versions of the module are loaded it interops.

So that for an unknown x `typeof x === "object" && x !== null && Symbol.for("isCancellation") in x`

___

