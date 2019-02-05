import { CancellationError } from "../interfaces";

/**
 * Create a cancellation error with the specified reason.
 *
 * The error is just marked with isCancellationError so that checking
 * it works across realms or using an isCancellationError from another
 * module on an error created with a different version of this module.
 *
 * @param reason the cancellation error message, defaults to "cancelled"
 */
export default function cancellationError(
  reason = "cancelled"
): CancellationError {
  const error = new Error(reason) as CancellationError;
  error.isCancellationError = true;
  return error;
}

export function isCancellationError(error: Error): error is CancellationError {
  return (error as CancellationError).isCancellationError === true;
}
