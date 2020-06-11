import { DisposableExecutor, Dispose } from "./interfaces.js";
import noopRaceCancel from "./noopRaceCancel.js";

/**
 * Creates a Promise that will cleanup on cancel.
 * @param executor just like a Promise executor but returns a cleanup function.
 * @param raceCancel a RaceCancel function that
 */
export default async function disposablePromise<TResult>(
  executor: DisposableExecutor<TResult>,
  raceCancel = noopRaceCancel
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
