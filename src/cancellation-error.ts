const CANCELLATION_SET = new WeakSet();

export default function cancellationError(reason: string) {
  const error = new Error(reason);
  CANCELLATION_SET.add(error);
  return error;
}

export function isCancellationError(error: Error) {
  return CANCELLATION_SET.has(error);
}
