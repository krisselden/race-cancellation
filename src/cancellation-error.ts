export type CancellationError = Error & { isCancellationError: true };

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
