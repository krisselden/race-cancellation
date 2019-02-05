import {
  CreateCancellationError,
  IsCancelled,
  Race,
  Task,
  Thunk,
} from "../interfaces";
import cancellationError from "./cancellation-error";

/**
 * Create a race cancellation function.
 *
 * This function is intended to be used with `deferred`, a higher level
 * version of this is `raceCancellationFromTask` for creating one from
 * from a cancellation task.
 *
 * @param cancellation a function that materializes the cancellation promise
 *                     it should return the same promise if called more than once
 * @param isCancelled a function that returns if we are cancelled, used to avoid starting
 *                    a raced task if we are already cancelled.
 * @param createCancellationError a function that creates the cancellation error to throw
 */
export default function createRaceCancellation(
  cancellation: Thunk<Promise<void>>,
  isCancelled: IsCancelled,
  createCancellationError: CreateCancellationError = cancellationError
): Race {
  return task => raceCancellation(cancellationWithThrow, isCancelled, task);

  function cancellationWithThrow() {
    return cancellation().then(throwError);
  }

  function throwError(): never {
    throw createCancellationError();
  }
}

function raceCancellation<Result>(
  cancellation: Thunk<Promise<never>>,
  isCancelled: IsCancelled,
  task: Task<Result> | Promise<Result>
): Promise<Result> {
  let result: Promise<Result>;
  if (typeof task === "function") {
    // avoid starting task if already cancelled
    if (isCancelled()) {
      return cancellation();
    }
    result = task();
  } else {
    result = task;
  }
  return Promise.race([result, cancellation()]);
}
