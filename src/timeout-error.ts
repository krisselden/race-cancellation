import { TimeoutError } from "../interfaces";
import cancellationError from "./cancellation-error";

/**
 * Create a timeout error, the error is just marked with
 * isTimeoutError so that checking it works across realms
 * unlike instanceof or marking it with a symbol.
 * @param reason the timeout error message defaults to "timed out"
 */
export default function timeoutError(reason = "timed out"): TimeoutError {
  const error = cancellationError(reason) as TimeoutError;
  error.isTimeoutError = true;
  return error;
}

export function isTimeoutError(error: Error): error is TimeoutError {
  return (error as TimeoutError).isTimeoutError === true;
}
