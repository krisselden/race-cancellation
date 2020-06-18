import { DisposableExecutorFn, DisposeFn, RaceCancelFn } from "./interfaces.js";
import noopRaceCancel from "./noopRaceCancel.js";

/**
 * Creates a cancellable Promise from an executor that returns a {@link DisposeFn} function and a {@link RaceCancelFn} function.
 *
 * @param disposableExecutor - a {@link DisposableExecutorFn} function (this will not be run if already cancelled).
 * @param raceCancel - a {@link RaceCancelFn} function to race against the disposable promise against.
 * @public
 */
export default async function cancellablePromise<TResult>(
  disposableExecutor: DisposableExecutorFn<TResult>,
  raceCancel: RaceCancelFn = noopRaceCancel
): Promise<TResult> {
  let dispose: DisposeFn | undefined;
  try {
    return await raceCancel(
      () =>
        new Promise<TResult>((resolve, reject) => {
          dispose = disposableExecutor(resolve, reject);
        })
    );
  } finally {
    if (dispose !== undefined) {
      dispose();
    }
  }
}
