import cancellationError, { CancellationError } from "./cancellation-error";

export type TimeoutError = CancellationError & { isTimeoutError: true };

export default function timeoutError(reason = "timed out"): TimeoutError {
  const error = cancellationError(reason);
  return Object.assign(error, { isTimeoutError: true as true });
}

export function isTimeoutError(error: any): error is TimeoutError {
  return error !== null && typeof error === "object" && error.isTimeoutError === true;
}
