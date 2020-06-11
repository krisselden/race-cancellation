import combineRaceCancel from "./combineRace.js";
import {
  CancellableTask,
  CancellationTask,
  CancelReason,
  Dispose,
  TaskWithRaceCancel,
} from "./interfaces.js";
import newRaceCancel from "./newRaceCancel.js";

/**
 * Wrap a cancellable task with a disposable cancellation concern.
 */
export default function withRaceCancel<TResult>(
  task: CancellableTask<TResult>,
  cancellationTask: CancellationTask
): TaskWithRaceCancel<TResult> {
  return async (raceCancel) => {
    let cancelled = false;
    let cancelReason: CancelReason | undefined;
    let dispose: Dispose | undefined;
    try {
      return await task(
        combineRaceCancel(
          raceCancel,
          newRaceCancel(
            () => cancelled,
            (cb) => {
              dispose = cancellationTask((reason) => {
                cancelled = true;
                cancelReason = reason;
                cb();
              });
            },
            () => cancelReason
          )
        )
      );
    } finally {
      if (dispose !== undefined) {
        dispose();
      }
    }
  };
}
