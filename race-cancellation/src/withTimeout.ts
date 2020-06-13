import { CancellableTask, RaceCancel, TimeoutError } from "./interfaces.js";
import withDisposableCancel from "./withDisposableCancel.js";

declare let setTimeout: (callback: () => void, milliseconds: number) => unknown;
declare let clearTimeout: (id: unknown) => void;

/**
 * Wrap a cancellable task with a timeout.
 *
 * ```js
 * async function fetchWithTimeout(url, timeoutMs, raceCancel) {
 *   return await withTimeout((raceTimeout) => cancellableFetch(url, raceTimeout), timeoutMs, raceCancel);
 * }
 * ```
 *
 * @param task - a cancellable task
 * @param milliseconds - a timeout in miliseconds
 * @param raceCancel - an optional outer {@link RaceCancel} function
 * @public
 */
export default function withTimeout<TResult>(
  task: CancellableTask<TResult>,
  milliseconds: number,
  raceCancel?: RaceCancel
): Promise<TResult> {
  return withDisposableCancel(
    task,
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
