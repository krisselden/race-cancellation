import { Cancellation } from "./interfaces.js";
import intoCancellationError from "./intoCancellationError.js";
import isCancellation from "./isCancellation.js";

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
