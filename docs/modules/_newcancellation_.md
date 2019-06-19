[race-cancellation](../README.md) > ["newCancellation"](../modules/_newcancellation_.md)

# External module: "newCancellation"

## Index

### Functions

* [newCancellation](_newcancellation_.md#newcancellation)

---

## Functions

<a id="newcancellation"></a>

###  newCancellation

▸ **newCancellation**(kind: *`undefined`*, message?: *`undefined` \| `string`*): [Cancellation](../interfaces/_interfaces_.cancellation.md)<[Cancellation](../enums/_interfaces_.cancellationkind.md#cancellation)>

▸ **newCancellation**<`Kind`>(kind: *`Kind`*, message?: *`undefined` \| `string`*): [Cancellation](../interfaces/_interfaces_.cancellation.md)<`Kind`>

▸ **newCancellation**<`Kind`>(kind?: *[Kind]()*, message?: *`undefined` \| `string`*): [Cancellation](../interfaces/_interfaces_.cancellation.md)<`Kind` \| [Cancellation](../enums/_interfaces_.cancellationkind.md#cancellation)>

*Defined in [newCancellation.ts:13](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newCancellation.ts#L13)*

Creates a new `Cancellation`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| kind | `undefined` |
| `Optional` message | `undefined` \| `string` |  the cancellation error message, defaults to "cancelled" |

**Returns:** [Cancellation](../interfaces/_interfaces_.cancellation.md)<[Cancellation](../enums/_interfaces_.cancellationkind.md#cancellation)>

*Defined in [newCancellation.ts:24](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newCancellation.ts#L24)*

Creates a new `Cancellation`.

**Type parameters:**

#### Kind :  `string`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| kind | `Kind` |
| `Optional` message | `undefined` \| `string` |  the cancellation error message, defaults to "the task was cancelled" |

**Returns:** [Cancellation](../interfaces/_interfaces_.cancellation.md)<`Kind`>

*Defined in [newCancellation.ts:35](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newCancellation.ts#L35)*

Creates a new `Cancellation`.

**Type parameters:**

#### Kind :  `string`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` kind | [Kind]() |  optional kind, defaults to \`CancellationKind.Cancellation\` |
| `Optional` message | `undefined` \| `string` |  the cancellation error message, defaults to "the task was cancelled" |

**Returns:** [Cancellation](../interfaces/_interfaces_.cancellation.md)<`Kind` \| [Cancellation](../enums/_interfaces_.cancellationkind.md#cancellation)>

___

