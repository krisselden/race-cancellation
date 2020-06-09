import { Cancellation, Dispose, Executor } from "./interfaces.js";
import noop from "./noopRaceCancellation.js";

export default async function disposablePromise<Result>(
  executor: Executor<Result>,
  raceCancellation = noop
): Promise<Result | Cancellation> {
  let dispose: Dispose | undefined;
  try {
    return await raceCancellation(
      () =>
        new Promise<Result>((resolve, reject) => {
          dispose = executor(resolve, reject);
        })
    );
  } finally {
    if (dispose !== undefined) {
      dispose();
    }
  }
}