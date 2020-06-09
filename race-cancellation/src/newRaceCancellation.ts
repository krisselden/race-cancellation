import {
  Cancellation,
  IntoCancellation,
  RaceCancellation,
  Task,
} from "./interfaces.js";
import { hasCompleted, Oneshot } from "./internal.js";
import isCancellation from "./isCancellation.js";
import newCancellation from "./newCancellation.js";
import { intoOneshot } from "./oneshot.js";

/**
 * Create a race cancellation function.
 *
 * @param cancellation a function that lazily builds the cancellation promise.
 *                     it is not called if we are already cancelled so it should not close over
 *                     an unchained promise or if it rejects it will cause an unhandled rejection.
 * @param intoCancellation a function that creates the cancellation from the cancellation result.
 */
export default function newRaceCancellation<CancellationResult = unknown>(
  cancellation: () => PromiseLike<CancellationResult>,
  intoCancellation: IntoCancellation<CancellationResult>
): RaceCancellation;

/**
 * Create a race cancellation function.
 *
 * @param cancellation a function that lazily builds the cancellation promise.
 *                     it is not called if we are already cancelled so it should not close over
 *                     an unchained promise or if it rejects it will cause an unhandled rejection.
 * @param cancellationMessage a message for the cancellation.
 * @param cancellationKind the kind of cancellation, defaults to `CancellationKind.Cancellation`.
 */
export default function newRaceCancellation(
  cancellation: () => PromiseLike<unknown>,
  cancellationMessage?: string,
  cancellationKind?: string
): RaceCancellation;
export default function newRaceCancellation<CancellationResult = unknown>(
  cancellation: () => PromiseLike<CancellationResult>,
  cancellationMessage?: string | IntoCancellation<CancellationResult>,
  cancellationKind?: string
): RaceCancellation {
  const cancellationOneshot = intoOneshot(cancellation);
  const intoCancellation =
    typeof cancellationMessage === "function"
      ? cancellationMessage
      : newIntoCancellation<CancellationResult>(
          cancellationMessage,
          cancellationKind
        );
  return (task) =>
    raceCancellation(cancellationOneshot, task, intoCancellation);
}

function raceCancellation<TaskResult, CancellationResult>(
  cancellation: Oneshot<CancellationResult>,
  task: Task<TaskResult> | PromiseLike<TaskResult>,
  intoCancellation: IntoCancellation<CancellationResult>
): Promise<TaskResult | Cancellation> {
  return typeof task === "function"
    ? cancellation[hasCompleted]
      ? cancellation().then(intoCancellation)
      : Promise.race([task(), cancellation().then(intoCancellation)])
    : Promise.race([task, cancellation().then(intoCancellation)]);
}

function newIntoCancellation<T>(
  cancellationMessage?: string,
  cancellationKind?: string
): IntoCancellation<T> {
  return function intoCancellation(result: T) {
    if (isCancellation(result)) {
      return result;
    }
    return newCancellation(cancellationKind, cancellationMessage);
  };
}
