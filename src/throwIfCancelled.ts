import { Cancellation } from "./interfaces";
import intoCancellationError from "./intoCancellationError";
import isCancellation from "./isCancellation";

/**
 * Throw if the `result` is a `Cancellation` otherwise return it.
 * @param result the result of a cancellable task.
 */
export default function throwIfCancelled<Result>(
  result: Result | Cancellation
): Result {
  if (isCancellation(result)) {
    throw intoCancellationError(result);
  }
  return result;
}
