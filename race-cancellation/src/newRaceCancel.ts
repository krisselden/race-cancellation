import {
  CancelReason,
  IsCancelled,
  OnCancel,
  RaceCancel,
  Task,
} from "./interfaces.js";
import intoCancelError from "./intoCancelError.js";

const cancelToken = Symbol("cancelled");

/**
 * Create a race cancellation function.
 *
 * @param isCancelled a function that returns whether or not we are currently cancelled
 * @param onCancel a callback that receives a callback for the cancel event
 * @param cancelReason an optional reason for the cancellation
 */
export default function newRaceCancel(
  isCancelled: IsCancelled,
  onCancel: OnCancel,
  cancelReason?: (() => CancelReason | undefined) | CancelReason
): RaceCancel {
  return async (taskOrPromise) =>
    throwIfCancelled(
      await raceCancel(taskOrPromise, isCancelled, onCancel),
      cancelReason
    );
}

function raceCancel<TResult>(
  taskOrPromise: Task<TResult> | PromiseLike<TResult>,
  isCancelled: IsCancelled,
  onCancel: OnCancel
): Promise<TResult | typeof cancelToken> {
  if (typeof taskOrPromise === "function") {
    return raceCancelVersusTask(taskOrPromise, isCancelled, onCancel);
  }
  return raceCancelVersusPromise(taskOrPromise, isCancelled, onCancel);
}

function raceCancelVersusTask<TResult>(
  task: Task<TResult>,
  isCancelled: IsCancelled,
  onCancel: OnCancel
): Promise<TResult | typeof cancelToken> {
  // if cancelled we don't bother starting the task
  // it is imperative that the task doesn't close over floating promises
  // unless those floating promises are cached and already chained to
  // something else, since we do not start the task if it is already
  // cancelled
  return isCancelled()
    ? Promise.resolve(cancelToken)
    : // ensure we create the promise chain before invoking the user task
      Promise.race([Promise.resolve().then(task), waitForCancel(onCancel)]);
}

function raceCancelVersusPromise<TResult>(
  promise: PromiseLike<TResult>,
  isCancelled: IsCancelled,
  onCancel: OnCancel
): Promise<TResult | typeof cancelToken> {
  // even if we are already cancelled we still need to ensure the floating
  // promise gets chained or it could cause an unhandled rejection
  return Promise.race([
    promise,
    isCancelled() ? Promise.resolve(cancelToken) : waitForCancel(onCancel),
  ]);
}

function throwIfCancelled<TResult>(
  result: TResult | typeof cancelToken,
  cancelReason?: (() => CancelReason | undefined) | CancelReason
): TResult {
  if (result === cancelToken) {
    throw intoCancelError(cancelReason);
  }
  return result;
}

function waitForCancel(onCancel: OnCancel): Promise<typeof cancelToken> {
  return new Promise((resolve) => onCancel(() => resolve(cancelToken)));
}
