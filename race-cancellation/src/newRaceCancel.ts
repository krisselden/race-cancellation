import {
  CancelError,
  CancelExecutor,
  CancelReason,
  IsCancelled,
  RaceCancel,
  Task,
} from "./interfaces.js";

// we are casting the sentinel value to a unique symbol
// to get === union narrowing
const sentinelValue: unique symbol = {
  toString: () => "[cancel sentinel]",
} as never;

type CancelTask = () => Promise<CancelSentinelValue>;
type CancelSentinelValue = typeof sentinelValue;

/**
 * Create a race cancellation function.
 *
 * @param isCancelled - a function that returns whether or not we are currently cancelled
 * @param executor - a callback to resolve the cancellation
 * @param cancelReason - an optional reason for the cancellation
 * @public
 */
export default function newRaceCancel(
  isCancelled: IsCancelled,
  executor: CancelExecutor,
  cancelReason?: (() => CancelReason | undefined) | CancelReason
): RaceCancel {
  const cancelTask = memoizeCancel(isCancelled, executor);
  return async (taskOrPromise) =>
    throwIfCancelled(
      await raceCancel(taskOrPromise, isCancelled, cancelTask),
      cancelReason
    );
}

function raceCancel<TResult>(
  taskOrPromise: Task<TResult> | PromiseLike<TResult>,
  isCancelled: IsCancelled,
  cancelTask: CancelTask
): Promise<TResult | CancelSentinelValue> {
  return typeof taskOrPromise === "function"
    ? isCancelled()
      ? cancelTask()
      : Promise.race([taskOrPromise(), cancelTask()])
    : Promise.race([taskOrPromise, cancelTask()]);
}

function throwIfCancelled<TResult>(
  result: TResult | CancelSentinelValue,
  cancelReason?: (() => CancelReason | undefined) | CancelReason
): TResult {
  if (result === sentinelValue) {
    throw intoCancelError(cancelReason);
  }
  return result;
}

function memoizeCancel(
  isCancelled: IsCancelled,
  executor: CancelExecutor
): CancelTask {
  let promise: Promise<CancelSentinelValue> | undefined;
  return () => {
    if (promise === undefined) {
      promise = isCancelled()
        ? Promise.resolve(sentinelValue)
        : waitForCancel(executor);
    }
    return promise;
  };
}

async function waitForCancel(
  cancelExecutor: CancelExecutor
): Promise<CancelSentinelValue> {
  await new Promise(cancelExecutor);
  return sentinelValue;
}

function intoCancelError(
  cancelReason?: (() => CancelReason | undefined) | CancelReason
): CancelError<string> {
  if (typeof cancelReason === "function") {
    cancelReason = cancelReason();
  }
  if (cancelReason === undefined || typeof cancelReason === "string") {
    return newCancelError(cancelReason);
  }
  return cancelReason;
}

function newCancelError(message = "The operation was cancelled"): CancelError {
  const cancelError = new Error(message) as CancelError;
  cancelError.name = "CancelError";
  cancelError.isCancelled = true;
  return cancelError;
}
