import composeRaceCancel from "./composeRaceCancel.js";
import deferCancel from "./deferCancel.js";
import { CancellableTask, RaceCancel } from "./interfaces.js";

/**
 * Wrap a cancellable task to cancel tasks still pending when another concurrent
 * task's promise either rejected in a Promise.all() or won in a Promise.race().
 *
 * @param cancellableTask - a {@link CancellableTask} function to run with cancel pending
 * @param outerRaceCancel - an optional outer {@link RaceCancel} function
 * @public
 */
export default async function withCancelPending<TResult>(
  cancellableTask: CancellableTask<TResult>,
  outerRaceCancel?: RaceCancel
): Promise<TResult> {
  const [raceSettled, settled] = deferCancel();
  try {
    return await cancellableTask(
      composeRaceCancel(raceSettled, outerRaceCancel)
    );
  } finally {
    settled(
      "The operation was cancelled because it was still pending when another concurrent promise either rejected in a Promise.all() or won in a Promise.race()."
    );
  }
}
