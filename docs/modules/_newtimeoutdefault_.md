[race-cancellation](../README.md) > ["newTimeoutDefault"](../modules/_newtimeoutdefault_.md)

# External module: "newTimeoutDefault"

## Index

### Type aliases

* [TimeoutID](_newtimeoutdefault_.md#timeoutid)

### Variables

* [clearTimeout](_newtimeoutdefault_.md#cleartimeout)
* [newTimeoutDefault](_newtimeoutdefault_.md#newtimeoutdefault)
* [setTimeout](_newtimeoutdefault_.md#settimeout)

---

## Type aliases

<a id="timeoutid"></a>

###  TimeoutID

**Ƭ TimeoutID**: *`unknown`*

*Defined in [newTimeoutDefault.ts:3](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newTimeoutDefault.ts#L3)*

___

## Variables

<a id="cleartimeout"></a>

### `<Const>` clearTimeout

**● clearTimeout**: *`function`*

*Defined in [newTimeoutDefault.ts:9](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newTimeoutDefault.ts#L9)*

#### Type declaration
▸(id: *[TimeoutID](_newtimeoutdefault_.md#timeoutid)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | [TimeoutID](_newtimeoutdefault_.md#timeoutid) |

**Returns:** `void`

___
<a id="newtimeoutdefault"></a>

### `<Const>` newTimeoutDefault

**● newTimeoutDefault**: *[NewTimeout](_interfaces_.md#newtimeout)* =  (() => {
  /* istanbul ignore if */
  if (typeof setTimeout !== "function") {
    // setTimeout is not actually part of the script host definition
    // but the expectation is that if you are running on a host that
    // doesn't have setTimeout defined is that you do not rely on the
    // default
    return undefined as never;
  }

  function newTimeout(callback: () => void, miliseconds: number) {
    const id = setTimeout(callback, miliseconds);
    return () => clearTimeout(id);
  }

  return newTimeout;
})()

*Defined in [newTimeoutDefault.ts:14](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newTimeoutDefault.ts#L14)*

Default CreateTimeout implementation using setTimeout/clearTimeout, allows

___
<a id="settimeout"></a>

### `<Const>` setTimeout

**● setTimeout**: *`function`*

*Defined in [newTimeoutDefault.ts:5](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/newTimeoutDefault.ts#L5)*

#### Type declaration
▸(callback: *`function`*, miliseconds: *`number`*): [TimeoutID](_newtimeoutdefault_.md#timeoutid)

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |
| miliseconds | `number` |

**Returns:** [TimeoutID](_newtimeoutdefault_.md#timeoutid)

___

