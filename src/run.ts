import { CancellableTask, Race } from "../interfaces";
import cancellableRace from "./cancellable-race";
import cancellationError from "./cancellation-error";
import combineRace from "./combine-race";

const throwShortCircuited = () => {
  throw cancellationError("short-circuited");
};

/**
 * Run a task with a race of the task winning promise chain so that any short-circuited child
 * chains due to `Promise.all` or `Promise.race` can be raced against the winner.
 *
 * If race function is never called a promise for the cancellation will
 * never be created so that exit will not generate any unhandled rejections.
 *
 * If the parent task has resolved already, the subtask passed to race will not
 * be started.
 *
 * @param task a cancellable task
 * @param raceCancellation optional outer race cancellation
 */
export default async function run<Result>(
  task: CancellableTask<Result>,
  raceCancellation?: Race
): Promise<Result> {
  const [raceWinner, cancelLosers] = cancellableRace(throwShortCircuited);
  try {
    return await task(combineRace(raceCancellation, raceWinner));
  } finally {
    cancelLosers();
  }
}
