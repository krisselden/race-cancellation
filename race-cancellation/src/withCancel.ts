import composeRaceCancel from "./composeRaceCancel.js";
import {
  CancellableAsyncFn,
  CancelReason,
  DisposableCancelExecutorFn,
  DisposeFn,
  RaceCancelFn,
} from "./interfaces.js";
import newRaceCancel from "./newRaceCancel.js";

/**
 * Run a {@link CancellableAsyncFn} function with a {@link RaceCancelFn} adapted from a {@link DisposableCancelExecutorFn} function.
 *
 * @param cancellableAsync - a {@link CancellableAsyncFn} function
 * @param disposableCancelExecutor - a {@link DisposableCancelExecutorFn} function that will only be called once
 * @param outerRaceCancel - an optional outer {@link RaceCancelFn} function that will be composed with the {@link RaceCancelFn} function before being passed to the {@link CancellableAsyncFn} function.
 * @public
 */
export default async function withCancel<TResult>(
  cancellableAsync: CancellableAsyncFn<TResult>,
  disposableCancelExecutor: DisposableCancelExecutorFn,
  outerRaceCancel?: RaceCancelFn
): Promise<TResult> {
  let cancelled = false;
  let cancelReason: CancelReason | undefined;
  let dispose: DisposeFn | undefined;
  const raceCancel = newRaceCancel(
    () => cancelled,
    (resolveCancel) => {
      dispose = disposableCancelExecutor((reason) => {
        cancelled = true;
        cancelReason = reason;
        resolveCancel();
      });
    },
    () => cancelReason
  );
  try {
    return await cancellableAsync(
      composeRaceCancel(raceCancel, outerRaceCancel)
    );
  } finally {
    if (dispose !== undefined) {
      dispose();
    }
  }
}
