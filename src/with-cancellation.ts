import { CancellableTask } from "../interfaces";
import combineRace from "./combine-race";
import raceCancellation from "./race-cancellation";

/**
 * Wrap a cancellable task with a race against another cancellable task.
 *
 * Intended to be used with run so that the cancellation task is cancelled
 * if the task wins the race and so that an outer cancellation concern
 * is composed with the short circuiting cancellation.
 *
 * ```js
 * async function parentTask(raceOuterCancellation) {
 *   return await run(
 *     withCancellation(
 *       raceOuterCancellationAndShortCircuitAndTimeout =>
 *         childTask(raceOuterCancellationAndShortCircuitAndTimeout),
 *       raceOuterCancellationAndShortCircuit =>
 *         sleep(TIMEOUT_MS, raceOuterCancellationAndShortCircuit),
 *       () => {
 *         throw cancellationError("timed out");
 *       }
 *     ),
 *     raceOuterCancellation
 *   );
 * }
 * ```
 *
 * @param task a cancellable task
 * @param cancellationTask a cancellable cancellation task
 * @param throwCancellationError an error to throw if cancellation task wins
 */
export default function withCancellation<Result>(
  task: CancellableTask<Result>,
  cancellationTask: CancellableTask<void>,
  throwCancellationError?: () => never
): CancellableTask<Result> {
  return outerRace => {
    const innerRace = raceCancellation(
      () => cancellationTask(outerRace),
      throwCancellationError
    );
    return task(combineRace(outerRace, innerRace));
  };
}
