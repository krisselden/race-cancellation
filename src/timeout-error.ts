import cancellationError, { CancellationError } from "./cancellation-error";

export type TimeoutError = CancellationError & { isTimeoutError: true };

export default function timeoutError(reason = "timed out"): TimeoutError {
  const error = cancellationError(reason) as TimeoutError;
  error.isTimeoutError = true;
  return error;
}

export function isTimeoutError(error: Error): error is TimeoutError {
  return (error as TimeoutError).isTimeoutError === true;
}
