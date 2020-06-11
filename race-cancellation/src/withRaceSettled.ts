import cancellableRace from "./cancellableRace.js";
import combineRace from "./combineRace.js";
import {
  CancellableTask,
  RaceCancel,
  TaskWithRaceCancel,
} from "./interfaces.js";

/**
 * Wrap a cancellable task combining its input `RaceCancellation` with a race against the task
 * being settled, so that if any cancellable sub-tasks are combined with `Promise.all`
 * or `Promise.race` they will be cancelled if their branch was short circuited by
 * another branch rejecting in a `Promise.all` or their branch lost to another branch in a
 * `Promise.race`.
 *
 * @param task a cancellable task
 * @returns an optionally cancellable task
 */
export default function withRaceSettled<TResult>(
  task: CancellableTask<TResult>
): TaskWithRaceCancel<TResult> {
  const [raceSettled, cancel] = cancellableRace();
  return async (raceCancel?: RaceCancel) => {
    try {
      return await task(combineRace(raceCancel, raceSettled));
    } finally {
      cancel(
        "The operation was cancelled because it was still pending when another concurrent promise either rejected in a Promise.all() or won in a Promise.race()."
      );
    }
  };
}
