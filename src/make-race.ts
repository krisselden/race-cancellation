import { RaceCancellation, Task } from "../interfaces";
import { defaultThrowCancellationError } from "./errors";

export function makeRace(
  cancellationTask: Task<void> | Promise<void>,
  throwCancellationError = defaultThrowCancellationError,
  isCancelled?: () => boolean
): RaceCancellation {
  if (isCancelled === undefined) {
    return makeRaceWithDefaultIsCancelled(
      cancellationTask,
      throwCancellationError
    );
  }
  return makeRaceWithAllArgs(
    cancellationTask,
    throwCancellationError,
    isCancelled
  );
}

function makeRaceWithDefaultIsCancelled(
  cancellationTask: Task<void> | Promise<void>,
  throwCancellationError: () => never
): RaceCancellation {
  let cancelled = false;
  return makeRaceWithAllArgs(
    async () => {
      try {
        await (typeof cancellationTask === "function"
          ? cancellationTask()
          : cancellationTask);
      } finally {
        cancelled = true;
      }
    },
    throwCancellationError,
    () => cancelled
  );
}

function makeRaceWithAllArgs(
  cancellationTask: Task<void> | Promise<void>,
  throwCancellationError: () => never,
  isCancelled: () => boolean
): RaceCancellation {
  let cancellationPromise: Promise<void> | undefined;

  return async <T>(task: Task<T> | Promise<T>) => {
    let taskPromise: Promise<T> | undefined;

    if (typeof task === "function") {
      // if cancelled, avoid starting task
      if (!isCancelled()) {
        taskPromise = task();
      }
    } else {
      taskPromise = task;
    }

    // start cancellation but only if not cached already
    if (cancellationPromise === undefined) {
      if (typeof cancellationTask === "function") {
        cancellationPromise = cancellationTask();
      } else {
        cancellationPromise = cancellationTask;
      }
    }

    if (taskPromise === undefined) {
      // task is undefined when the task hasn't started
      // because isCancelled true
      return cancellationPromise.then(throwCancellationError);
    }

    return await Promise.race<T, never>([
      taskPromise,
      cancellationPromise.then(throwCancellationError),
    ]);
  };
}
