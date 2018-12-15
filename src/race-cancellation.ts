import { Race, Task } from "../interfaces";
import cancellationError from "./cancellation-error";

const defaultThrowCancellationError = () => {
  throw cancellationError("cancelled");
};

export default function raceCancellation(
  cancellation: Task<void> | Promise<void>,
  throwCancellationError = defaultThrowCancellationError,
  isCancelled?: () => boolean
): Race {
  if (isCancelled === undefined) {
    return createRaceCancellationWithDefaultIsCancelled(
      cancellation,
      throwCancellationError
    );
  }

  let cancellationPromise: Promise<void> | undefined;
  return <Result>(task: Task<Result> | Promise<Result>) => {
    let taskPromise: Promise<Result> | undefined;

    if (typeof task === "function") {
      // if we are already cancelled, avoid starting task
      if (!isCancelled()) {
        taskPromise = task();
      }
    } else {
      taskPromise = task;
    }

    // start cancellation if not started
    if (cancellationPromise === undefined) {
      if (typeof cancellation === "function") {
        cancellationPromise = cancellation();
      } else {
        cancellationPromise = cancellation;
      }
    }

    // if task was not started because already cancelled
    if (taskPromise === undefined) {
      // just return a Promise<never> from the cancellationPromise
      return cancellationPromise.then(throwCancellationError);
    }

    return Promise.race<Result, never>([
      taskPromise,
      cancellationPromise.then(throwCancellationError),
    ]);
  };
}

function createRaceCancellationWithDefaultIsCancelled(
  cancellation: Task<void> | Promise<void>,
  throwCancellationError: () => never
): Race {
  let cancelled = false;
  return raceCancellation(
    async () => {
      try {
        await (typeof cancellation === "function"
          ? cancellation()
          : cancellation);
      } finally {
        cancelled = true;
      }
    },
    throwCancellationError,
    () => cancelled
  );
}
