import { Task } from "../interfaces";

export default function once<Result>(
  task: Task<Result>
): () => Promise<Result> {
  let promise: Promise<Result> | undefined;
  return () => {
    if (promise === undefined) {
      promise = task();
    }
    return promise;
  };
}
