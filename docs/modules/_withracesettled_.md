[race-cancellation](../README.md) > ["withRaceSettled"](../modules/_withracesettled_.md)

# External module: "withRaceSettled"

## Index

### Functions

* [withRaceSettled](_withracesettled_.md#withracesettled)

---

## Functions

<a id="withracesettled"></a>

###  withRaceSettled

▸ **withRaceSettled**<`Result`>(task: *[CancellableTask](_interfaces_.md#cancellabletask)<`Result`>*): [OptionallyCancellableTask](_interfaces_.md#optionallycancellabletask)<`Result`>

*Defined in [withRaceSettled.ts:20](https://github.com/lynchbomb/race-cancellation/blob/c640e1a/src/withRaceSettled.ts#L20)*

Wrap a cancellable task combining its input `RaceCancellation` with a race against the task being settled, so that if any cancellable sub-tasks are combined with `Promise.all` or `Promise.race` they will be cancelled if their branch was short circuited by another branch rejecting in a `Promise.all` or their branch lost to another branch in a `Promise.race`.

**Type parameters:**

#### Result 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| task | [CancellableTask](_interfaces_.md#cancellabletask)<`Result`> |  a cancellable task |

**Returns:** [OptionallyCancellableTask](_interfaces_.md#optionallycancellabletask)<`Result`>
an optionally cancellable task

___

