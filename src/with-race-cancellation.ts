import { CancellableTask, CreateCancellationError, Race } from "../interfaces";
import combineRace from "./combine-race";
import raceCancellationFromTask from "./race-cancellation-from-task";
import withRaceSettled from "./with-race-settled";

/**
 * Wrap a cancellable task to pass in a raceCancellation that combines the input raceCancellation
 * with a race against a cancellable cancellation task.
 *
 * ```js
 * async function fetchWithTimeout(url, timeoutMs, outerRaceCancellation) {
 *   const cancellationTask = raceCancellation => sleep(timeoutMs, raceCancellation);
 *   const task = raceCancellation => cancellableFetch(url, raceCancellation);
 *   return await withRaceCancellableTask(
 *     task,
 *     cancellationTask,
 *     throwTimeoutError
 *   )(outerRaceCancellation);
 * }
 * ```
 *
 * @param task a cancellable task
 * @param cancellationTask a cancellable cancellation task
 * @param createCancellationError an error to throw if cancellation task wins
 */
export default function withRaceCancellation<Result>(
  task: CancellableTask<Result>,
  cancellationTask: CancellableTask<void>,
  createCancellationError?: CreateCancellationError
): (raceCancellation?: Race) => Promise<Result> {
  return withRaceSettled(raceCancellation =>
    task(
      combineRace(
        raceCancellation,
        raceCancellationFromTask(
          () => cancellationTask(raceCancellation),
          createCancellationError
        )
      )
    )
  );
}
