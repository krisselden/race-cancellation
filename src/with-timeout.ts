import { CancellableTask, TimeoutHost } from "../interfaces";
import combineRace from "./combine-race";
import raceCancellation from "./race-cancellation";
import sleep from "./sleep";
import timeoutError from "./timeout-error";

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
 * async function parentTask(outerRaceCancel) {
 *   const result = await run(
 *     withTimeout(innerRaceCancel => childTask(innerRaceCancel), 4000),
 *     outerRaceCancel
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
  return outerRace => {
    const cancellation = () => sleep(milliseconds, outerRace, timeoutHost);
    const raceTimeout = raceCancellation(cancellation, throwTimedOut);
    return task(combineRace(outerRace, raceTimeout));
  };
}
