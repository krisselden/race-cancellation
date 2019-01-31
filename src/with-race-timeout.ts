import {
  CancellableTask,
  CreateTimeout,
  OptionallyCancellableTask,
} from "../interfaces";
import sleep from "./sleep";
import timeoutError from "./timeout-error";
import withCancellation from "./with-race-cancellation";

/**
 * Wrap a cancellable task with a timeout.
 *
 * Since the timeout is itself canceable this is intended to be used
 * with run() so that the timeout itself will be cancelled if it loses
 * the race.
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
 * @param createTimeout optional implementation of timeout creation for testing
 */
export default function withRaceTimeout<Result>(
  task: CancellableTask<Result>,
  milliseconds: number,
  createTimeout?: CreateTimeout
): OptionallyCancellableTask<Result> {
  return withCancellation(
    task,
    raceCancellation => sleep(milliseconds, raceCancellation, createTimeout),
    timeoutError
  );
}
