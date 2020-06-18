# race-cancellation
[![Build Status](https://travis-ci.org/krisselden/race-cancellation.svg?branch=master)](https://travis-ci.org/krisselden/race-cancellation)
[![Coverage Status](https://coveralls.io/repos/github/krisselden/race-cancellation/badge.svg?branch=master)](https://coveralls.io/github/krisselden/race-cancellation?branch=master)

[API Docs](./docs/race-cancellation.md)

This is a library with utils to implement a cancellable async function
with a pattern that solves a number of issues with cancellation of promises.

The pattern is a cancellable async function takes a function that will build
the cancellation race lazily.

## Design Constraints

- Composable
  - Cancellation concerns can be composed easily
- Lazy
  - Should not create the Promise<never> until it is raced or it will create meaningless unhandledRejections
  - Should be able to avoid invoking the raced async function if it is already cancelled
  - Should be able to avoid invoking the cancellation task if the outer scope cancellation already won
- Adaptable
  - Should be easy to adapt other promise cancellation patterns

## RaceCancellation Interface

```ts
export type AsyncFn<T> = () => Promise<T>;
export type RaceCancelFn = <T>(asyncFnOrPromise: AsyncFn<T> | PromiseLike<T>) => Promise<T>;
export type CancellableAsyncFn<T> = (raceCancel: RaceCancelFn) => Promise<T>;
```

Since race cancellation is a function it can lazily create the Promise<never> to
avoid unhandledRejection.

Since it can take a function to invoke to produce the task,
it can avoid starting the task if it is already cancelled and can avoid creating the Promise<never>
if the task fails on invoke.

This also allows the combined race cancellations to be lazy.
For example, if we are already cancelled because we are disconnected
we don't need to start a timeout.

## Examples of Cancellable Async Functions

```js
import * as fs from "fs";

async function pollFile(path, interval, raceCancel) {
  while (!fs.existsSync(path)) {
    await sleep(interval, raceCancel);
  }
}

async function sleep(ms, raceCancel) {
  let id;
  try {
    const createTimeout = () =>
      new Promise<void>(resolve => {
        id = setTimeout(resolve, ms);
      });
    // if cancellation has happened race cancel can return
    // a rejected promise without invoking createTimeout
    // otherwise createTimeout is called and raced against
    // a new Promise<never> created from the cancellation Promise,
    // cancellationPromise.then(throwCancellationError)
    return await raceCancel(createTimeout);
  } finally {
    if (id !== undefined) {
      // cleanup timeout so node will exit right away if
      // our script is done.
      clearTimeout(id);
    }
  }
}
```
