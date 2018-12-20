import { CancellableTask, TimeoutHost } from "../interfaces";
import sleep from "./sleep";
import timeoutError from "./timeout-error";
import withCancellation from "./with-cancellation";

const throwTimedOut = () => {
  throw timeoutError();
};

/**
 * Wrap a cancellable task with a timeout.
 *
 * Since the timeout is itself canceable this is intended to be used
 * with run() so that the timeout itself will be cancelled if it loses
 * the race.
 *
 * ```js
 * async function parentTask(outerRaceCancellation) {
 *   return await run(
 *     withTimeout(innerRaceCancellation => childTask(innerRaceCancellation), 4000),
 *     outerRaceCancellation
 *   );
 * }
 * ```
 *
 * @param task a cancellable task
 * @param milliseconds timeout in miliseconds
 * @param timeoutHost optional implementation of setTimeout/clearTimeout
 */
export default function withTimeout<Result>(
  task: CancellableTask<Result>,
  milliseconds: number,
  timeoutHost?: TimeoutHost
): CancellableTask<Result> {
  return withCancellation(
    task,
    raceCancellation => sleep(milliseconds, raceCancellation, timeoutHost),
    throwTimedOut
  );
}
