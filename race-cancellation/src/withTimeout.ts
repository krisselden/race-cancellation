import {
  CancellableAsyncFn,
  RaceCancelFn,
  TimeoutError,
} from "./interfaces.js";
import withDisposableCancel from "./withCancel.js";

declare let setTimeout: (callback: () => void, milliseconds: number) => unknown;
declare let clearTimeout: (id: unknown) => void;

/**
 * Wrap a cancellable async function with a timeout.
 *
 * @remarks
 *
 * @example
 * ```js
 * async function fetchWithTimeout(url, timeoutMs, raceCancel) {
 *   return await withTimeout((raceTimeout) => cancellableFetch(url, raceTimeout), timeoutMs, raceCancel);
 * }
 * ```
 *
 * @param cancellableAsync - a {@link CancellableAsyncFn} function
 * @param milliseconds - a timeout in miliseconds
 * @param raceCancel - an optional outer scope {@link RaceCancelFn} function that will be combined with the timeout race before being passed to the {@link CancellableAsyncFn} function
 * @public
 */
export default function withTimeout<TResult>(
  cancellableAsync: CancellableAsyncFn<TResult>,
  milliseconds: number,
  raceCancel?: RaceCancelFn
): Promise<TResult> {
  return withDisposableCancel(
    cancellableAsync,
    (resolve) => {
      const id = setTimeout(
        () => resolve(newTimeoutError(milliseconds)),
        milliseconds
      );
      return () => clearTimeout(id);
    },
    raceCancel
  );
}

function newTimeoutError(milliseconds: number): TimeoutError {
  const timeoutError = new Error(
    `The operation timed out after taking longer than ${milliseconds}ms`
  ) as TimeoutError;
  timeoutError.name = "TimeoutError";
  timeoutError.isCancelled = true;
  timeoutError.isTimeout = true;
  return timeoutError;
}
