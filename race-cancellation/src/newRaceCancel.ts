import {
  AsyncFn,
  CancelError,
  CancelExecutorFn,
  CancelReason,
  IsCancelledFn,
  RaceCancelFn,
} from "./interfaces.js";

// we are casting the sentinel value to a unique symbol
// to get === union narrowing
const sentinelValue: unique symbol = {
  toString: () => "[cancel sentinel]",
} as never;

type AsyncCancelFn = () => Promise<CancelSentinelValue>;
type CancelSentinelValue = typeof sentinelValue;

/**
 * Create a {@link RaceCancelFn} function.
 *
 * @param isCancelled - a function that returns whether or not we are currently cancelled
 * @param executor - a callback to resolve the cancellation
 * @param cancelReason - an optional reason for the cancellation
 * @public
 */
export default function newRaceCancel(
  isCancelled: IsCancelledFn,
  executor: CancelExecutorFn,
  cancelReason?: (() => CancelReason | undefined) | CancelReason
): RaceCancelFn {
  // the async cancel executor should only run 0 or 1 times
  const memoizedAsyncCancel = memoizeAsyncCancel(isCancelled, executor);
  return async (asyncFnOrPromise) =>
    throwIfCancelled(
      await raceCancel(asyncFnOrPromise, isCancelled, memoizedAsyncCancel),
      cancelReason
    );
}

function raceCancel<TResult>(
  asyncFnOrPromise: AsyncFn<TResult> | PromiseLike<TResult>,
  isCancelled: IsCancelledFn,
  memoizedAsyncCancel: AsyncCancelFn
): Promise<TResult | CancelSentinelValue> {
  return typeof asyncFnOrPromise === "function"
    ? isCancelled()
      ? memoizedAsyncCancel()
      : Promise.race([asyncFnOrPromise(), memoizedAsyncCancel()])
    : Promise.race([asyncFnOrPromise, memoizedAsyncCancel()]);
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

function memoizeAsyncCancel(
  isCancelled: IsCancelledFn,
  executor: CancelExecutorFn
): AsyncCancelFn {
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
  cancelExecutor: CancelExecutorFn
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
