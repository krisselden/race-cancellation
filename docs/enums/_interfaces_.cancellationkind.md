[race-cancellation](../README.md) > ["interfaces"](../modules/_interfaces_.md) > [CancellationKind](../enums/_interfaces_.cancellationkind.md)

# Enumeration: CancellationKind

## Index

### Enumeration members

* [Cancellation](_interfaces_.cancellationkind.md#cancellation)
* [ShortCircuit](_interfaces_.cancellationkind.md#shortcircuit)
* [Timeout](_interfaces_.cancellationkind.md#timeout)

---

## Enumeration members

<a id="cancellation"></a>

###  Cancellation

**Cancellation**:  = "Cancellation"

*Defined in [interfaces.ts:16](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L16)*

General cancellation request.

___
<a id="shortcircuit"></a>

###  ShortCircuit

**ShortCircuit**:  = "ShortCircuit"

*Defined in [interfaces.ts:27](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L27)*

A concurrent branch was the winner in a `Promise.race` or failed in a `Promise.all`

___
<a id="timeout"></a>

###  Timeout

**Timeout**:  = "Timeout"

*Defined in [interfaces.ts:21](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/interfaces.ts#L21)*

The task timed out.

___

