export type CancellationError = Error & { isCancellationError: true };

export default function cancellationError(reason = "cancelled"): CancellationError {
  const error = new Error(reason);
  return Object.assign(error, { isCancellationError: true as true });
}

export function isCancellationError(error: any): error is CancellationError {
  return error !== null && typeof error === "object" && error.isCancellationError === true;
}
