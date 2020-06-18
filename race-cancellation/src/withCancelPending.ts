import composeRaceCancel from "./composeRaceCancel.js";
import deferCancel from "./deferCancel.js";
import { CancellableAsyncFn, RaceCancelFn } from "./interfaces.js";

/**
 * Wrap a {@link CancellableAsyncFn} function to cancel still pending concurrent child {@link CancellableAsyncFn}
 * functions when another concurrent promise either rejected in a Promise.all() or won in a Promise.race().
 *
 * @param cancellableAsync - a {@link CancellableAsyncFn} function to run with cancel pending
 * @param outerRaceCancel - an optional outer {@link RaceCancelFn} function
 * @public
 */
export default async function withCancelPending<TResult>(
  cancellableAsync: CancellableAsyncFn<TResult>,
  outerRaceCancel?: RaceCancelFn
): Promise<TResult> {
  const [raceSettled, settled] = deferCancel();
  try {
    return await cancellableAsync(
      composeRaceCancel(raceSettled, outerRaceCancel)
    );
  } finally {
    settled(
      "The operation was cancelled because it was still pending when another concurrent promise either rejected in a Promise.all() or won in a Promise.race()."
    );
  }
}
