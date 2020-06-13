import defaultRaceCancel from "./defaultRaceCancel.js";
import { DisposableExecutor, Dispose, RaceCancel } from "./interfaces.js";

/**
 * Creates a Promise from an executor that returns a {@link Dispose} function.
 *
 * @param executor - a {@link DisposableExecutor} function.
 * @param raceCancel - a {@link RaceCancel} function to race against.
 * @public
 */
export default async function disposablePromise<TResult>(
  executor: DisposableExecutor<TResult>,
  raceCancel: RaceCancel = defaultRaceCancel
): Promise<TResult> {
  let dispose: Dispose | undefined;
  try {
    return await raceCancel(
      () =>
        new Promise<TResult>((resolve, reject) => {
          dispose = executor(resolve, reject);
        })
    );
  } finally {
    if (dispose !== undefined) {
      dispose();
    }
  }
}
