import { Dispose, Executor, Race } from "../interfaces";

export default async function disposablePromise<Result>(
  executor: Executor<Result>,
  raceCancellation: Race
) {
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
