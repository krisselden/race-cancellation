import { CancellableTask, TaskWithRaceCancel } from "./interfaces.js";
import newTimeout from "./newTimeout.js";
import newTimeoutError from "./newTimeoutError.js";
import withRaceCancel from "./withRaceCancel.js";

/**
 * Wrap a cancellable task with a timeout.
 *
 * ```js
 * async function fetchWithTimeout(url, timeoutMs, raceCancellation) {
 *   return await withRaceTimeout(raceTimeout => {
 *      return await cancellableFetch(url, raceTimeout));
 *   }, timeoutMs)(raceCancellation);
 * }
 * ```
 *
 * @param task a cancellable task
 * @param milliseconds timeout in miliseconds
 */
export default function withRaceTimeout<Result>(
  task: CancellableTask<Result>,
  milliseconds: number
): TaskWithRaceCancel<Result> {
  return withRaceCancel(task, (cancel) =>
    newTimeout(() => cancel(newTimeoutError(milliseconds)), milliseconds)
  );
}
