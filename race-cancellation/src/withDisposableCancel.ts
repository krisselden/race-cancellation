import composeRaceCancel from "./composeRaceCancel.js";
import {
  CancellableTask,
  CancelReason,
  DisposableCancelExecutor,
  Dispose,
  RaceCancel,
} from "./interfaces.js";
import newRaceCancel from "./newRaceCancel.js";

/**
 * Run a {@link CancellableTask} function with a {@link RaceCancel} adapted from a {@link DisposableCancelExecutor} function.
 * @param cancellableTask - a {@link CancellableTask} function
 * @param cancelExecutor - a {@link DisposableCancelExecutor} function will only be called once
 * @param outerRaceCancel - an optional outer {@link RaceCancel} function that will be composed with the inner {@link RaceCancel} function.
 * @public
 */
export default async function withDisposableCancel<TResult>(
  cancellableTask: CancellableTask<TResult>,
  cancelExecutor: DisposableCancelExecutor,
  outerRaceCancel?: RaceCancel
): Promise<TResult> {
  let cancelled = false;
  let cancelReason: CancelReason | undefined;
  let dispose: Dispose | undefined;
  const raceCancel = newRaceCancel(
    () => cancelled,
    (resolveCancel) => {
      dispose = cancelExecutor((reason) => {
        cancelled = true;
        cancelReason = reason;
        resolveCancel();
      });
    },
    () => cancelReason
  );
  try {
    return await cancellableTask(
      composeRaceCancel(raceCancel, outerRaceCancel)
    );
  } finally {
    if (dispose !== undefined) {
      dispose();
    }
  }
}
