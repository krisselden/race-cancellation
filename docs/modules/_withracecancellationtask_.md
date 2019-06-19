[race-cancellation](../README.md) > ["withRaceCancellationTask"](../modules/_withracecancellationtask_.md)

# External module: "withRaceCancellationTask"

## Index

### Functions

* [withRaceCancellationTask](_withracecancellationtask_.md#withracecancellationtask)

---

## Functions

<a id="withracecancellationtask"></a>

###  withRaceCancellationTask

▸ **withRaceCancellationTask**<`Result`>(task: *[CancellableTask](_interfaces_.md#cancellabletask)<`Result`>*, cancellationTask: *[CancellableTask](_interfaces_.md#cancellabletask)<`void` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)>*, cancellationMessage?: *`undefined` \| `string`*, cancellationKind?: *`undefined` \| `string`*): [OptionallyCancellableTask](_interfaces_.md#optionallycancellabletask)<`Result`>

*Defined in [withRaceCancellationTask.ts:35](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/withRaceCancellationTask.ts#L35)*

Wrap a cancellable task to pass in a raceCancellation that combines the input raceCancellation with a race against a cancellable cancellation task.

```js
async function fetchWithTimeout(url, timeoutMs, outerRaceCancellation) {
  const timeoutTask = raceCancellation => cancellableTimeout(timeoutMs, raceCancellation);
  const task = raceCancellation => cancellableFetch(url, raceCancellation);
  const taskWithTimeout = withRaceCancellableTask(
    task,
    timeoutTask,
    () => newTimeoutCancellation(`fetch did not resolve within ${timeoutMs}`),
  );
  return await taskWithTimeout(outerRaceCancellation);
}
```

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| task | [CancellableTask](_interfaces_.md#cancellabletask)<`Result`> |  a cancellable task |
| cancellationTask | [CancellableTask](_interfaces_.md#cancellabletask)<`void` \| [Cancellation](../interfaces/_interfaces_.cancellation.md)> |  a cancellable cancellation task, either resolves as void or it resolves in a \`Cancellation\`, if void, it will default the creating the default \`Cancellation\` or the provided \`newCancellation\` argument. |
| `Optional` cancellationMessage | `undefined` \| `string` |
| `Optional` cancellationKind | `undefined` \| `string` |

**Returns:** [OptionallyCancellableTask](_interfaces_.md#optionallycancellabletask)<`Result`>

___

