import { CreateCancellationError, Task } from "../interfaces";
import once from "./once";
import createRaceCancellation from "./race-cancellation";

/**
 * This is builds a race cancellation function with a start cancellation task function.
 *
 * This function ensures the start function is called only one time.
 *
 * It also tracks whether it is resolved so that if it is used in more than one branch
 * of the promise graph the other branches will not start their tasks if they are entered
 * in after the cancellation task has resolved.
 *
 * @param cancellationTask starts the cancellation task.
 * @param cancellationError a factory function for creating a cancellation error.
 */
export default function raceCancellationFromTask(
  cancellationTask: Task<void>,
  cancellationError?: CreateCancellationError
) {
  let cancelled = false;
  return createRaceCancellation(
    once(async () => {
      try {
        await cancellationTask();
      } finally {
        cancelled = true;
      }
    }),
    () => cancelled,
    cancellationError
  );
}
