import { CancellableTask, Race } from "../interfaces";
import cancellableRace from "./cancellable-race";
import cancellationError from "./cancellation-error";
import combineRace from "./combine-race";

const throwShortCircuited = () => {
  throw cancellationError("short-circuited");
};

/**
 * Run a task with a race of the task exit so that any short-circuited child tasks
 * due to `Promise.all` or `Promise.race` can be raced against their parents exit.
 *
 * If race function is never called a promise for the cancellation will
 * never be created so that exit will not generate any unhandled rejections.
 *
 * If the parent task has exited already, the subtask passed to race will not
 * be started.
 *
 * @param task a cancellable task
 * @param raceCancel the outside race cancellation
 */
export default async function run<Result>(
  task: CancellableTask<Result>,
  raceCancel?: Race
): Promise<Result> {
  const [raceExit, onExit] = cancellableRace(throwShortCircuited);
  try {
    return await task(combineRace(raceCancel, raceExit));
  } finally {
    // ensure we cancel losers in the above promise chain
    onExit();
  }
}
