[race-cancellation](../README.md) > ["isCancellation"](../modules/_iscancellation_.md)

# External module: "isCancellation"

## Index

### Functions

* [isCancellation](_iscancellation_.md#iscancellation)

---

## Functions

<a id="iscancellation"></a>

###  isCancellation

▸ **isCancellation**<`Kind`>(result: *`unknown`*, kind: *`Kind`*): `boolean`

▸ **isCancellation**(result: *`unknown`*): `boolean`

*Defined in [isCancellation.ts:15](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/isCancellation.ts#L15)*

Test whether an unknown result is a Cancellation of the specified kind.

```js
if (isCancellation(result, CancellationKind.Timeout)) {
  // retry
}
```

**Type parameters:**

#### Kind :  `string`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| result | `unknown` |  \- |
| kind | `Kind` |   |

**Returns:** `boolean`

*Defined in [isCancellation.ts:24](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/isCancellation.ts#L24)*

Test whether an unknown result is a Cancellation.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| result | `unknown` |   |

**Returns:** `boolean`

___

