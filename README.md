# race-cancellation

## About

This is a library with utils to implement a cancellable async function with
a pattern that solves a number of issues with cancellation of async functions.

### Constraints

- Composable
  - Cancellation concerns can be composed easily
- Lazy
  - Should not create the Promise<never> until it is raced or it will create meaningless unhandledRejections
  - Should be able to avoid invoking the raced task if it is already cancelled
  - Should be able to avoid invoking the cancellation task if the parent cancellation already won

### RaceCancellation Interface

```ts
export type RaceCancellation = {
  <T>(task: Promise<T> | Task<T>): Promise<T>;
};

export type Task<T> = () => Promise<T>;

export type CancellableTask<T> = (
  raceCancellation: RaceCancellation
) => Promise<T>;
```

Since race cancellation is a function it can lazily create the Promise<never> to
avoid unhandledRejection. It can also avoid creating the Promise<never> if the task invoke fails.

Since it can take a function to invoke to produce the task,
it can avoid starting the task if it is already cancelled and can avoid creating the Promise<never>
if the task fails on invoke.

This also allows the combined race cancellations to be lazy.
For example, if we are already cancelled because we are disconnected
we don't need to start a timeout.
