import cancellationError from "./cancellation-error";

const TIMEOUT_ERROR_SET = new WeakSet();

export function isTimeoutError(error: Error) {
  return TIMEOUT_ERROR_SET.has(error);
}

export default function timeoutError() {
  const error = cancellationError("timed-out");
  TIMEOUT_ERROR_SET.add(error);
  throw error;
}
