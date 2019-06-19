[race-cancellation](../README.md) > ["newRaceCancellation"](../modules/_newracecancellation_.md)

# External module: "newRaceCancellation"

## Index

### Type aliases

* [IntoCancellation](_newracecancellation_.md#intocancellation)

### Functions

* [newIntoCancellation](_newracecancellation_.md#newintocancellation)
* [newRaceCancellation](_newracecancellation_.md#newracecancellation)
* [raceCancellation](_newracecancellation_.md#racecancellation)

---

## Type aliases

<a id="intocancellation"></a>

###  IntoCancellation

**Ƭ IntoCancellation**: *`function`*

*Defined in [newRaceCancellation.ts:50](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newRaceCancellation.ts#L50)*

#### Type declaration
▸(result: *`unknown`*): [Cancellation](../interfaces/_interfaces_.cancellation.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| result | `unknown` |

**Returns:** [Cancellation](../interfaces/_interfaces_.cancellation.md)

___

## Functions

<a id="newintocancellation"></a>

###  newIntoCancellation

▸ **newIntoCancellation**(cancellationMessage?: *`undefined` \| `string`*, cancellationKind?: *`undefined` \| `string`*): [IntoCancellation](_newracecancellation_.md#intocancellation)

*Defined in [newRaceCancellation.ts:38](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newRaceCancellation.ts#L38)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` cancellationMessage | `undefined` \| `string` |
| `Optional` cancellationKind | `undefined` \| `string` |

**Returns:** [IntoCancellation](_newracecancellation_.md#intocancellation)

___
<a id="newracecancellation"></a>

###  newRaceCancellation

▸ **newRaceCancellation**(cancellation: *`function`*, cancellationMessage?: *`undefined` \| `string`*, cancellationKind?: *`undefined` \| `string`*): [RaceCancellation](_interfaces_.md#racecancellation)

*Defined in [newRaceCancellation.ts:13](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newRaceCancellation.ts#L13)*

Create a race cancellation function.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cancellation | `function` |  lazily builds the cancellation promise chain. |
| `Optional` cancellationMessage | `undefined` \| `string` |
| `Optional` cancellationKind | `undefined` \| `string` |

**Returns:** [RaceCancellation](_interfaces_.md#racecancellation)

___
<a id="racecancellation"></a>

###  raceCancellation

▸ **raceCancellation**<`Result`>(cancellation: *[Oneshot](../interfaces/_internal_.oneshot.md)<`unknown`>*, task: *[Task](_interfaces_.md#task)<`Result`> \| `PromiseLike`<`Result`>*, intoCancellation: *[IntoCancellation](_newracecancellation_.md#intocancellation)*): `Promise`<`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

*Defined in [newRaceCancellation.ts:26](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newRaceCancellation.ts#L26)*

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type |
| ------ | ------ |
| cancellation | [Oneshot](../interfaces/_internal_.oneshot.md)<`unknown`> |
| task | [Task](_interfaces_.md#task)<`Result`> \| `PromiseLike`<`Result`> |
| intoCancellation | [IntoCancellation](_newracecancellation_.md#intocancellation) |

**Returns:** `Promise`<`Result` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>

___

