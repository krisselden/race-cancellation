import { CancellableTask, OptionallyCancellableTask } from "../interfaces";
import cancellableRace from "./cancellable-race";
import cancellationError from "./cancellation-error";
import combineRace from "./combine-race";

/**
 * Wrap a cancellable task combining its input race with a race against the task
 * being settled, so that if any cancellable sub-tasks are combined with `Promise.all`
 * or `Promise.race` they will be cancelled if they are short circuited.
 *
 * @param task a cancellable task
 * @returns an optionally cancellable task
 */
export default function withRaceSettled<Result>(
  task: CancellableTask<Result>
): OptionallyCancellableTask<Result> {
  const [raceWinner, cancelLosers] = cancellableRace(createShortCircuitedError);
  return async raceCancellation => {
    try {
      return await task(combineRace(raceCancellation, raceWinner));
    } finally {
      cancelLosers();
    }
  };
}

function createShortCircuitedError() {
  return cancellationError("short-circuited");
}
