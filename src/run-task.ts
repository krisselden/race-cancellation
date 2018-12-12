import { CancellableTask } from "../interfaces";
import { makeCancellationError } from "./errors";
import { makeRaceAndCancel } from "./make-race-and-cancel";

const throwShortCircuited = () => {
  throw makeCancellationError("short-circuited");
};

/**
 * Run a task with a race of the task exit so that any short-circuited
 * child tasks due to `Promise.all` or `Promise.race` can be raced against
 * their parents exit.
 *
 * If race function is never called a promise for the cancellation will
 * never be created so that exit will not generate any unhandled rejections.
 *
 * If the parent task has exited already, the subtask passed to race will not
 * be started.
 *
 * @param task
 */
export async function runTask<T>(task: CancellableTask<T>): Promise<T> {
  const [race, cancel] = makeRaceAndCancel(throwShortCircuited);
  try {
    return await task(race);
  } finally {
    cancel();
  }
}
