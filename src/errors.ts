const ERROR_SET = new WeakSet();

export function isCancellationError(error: Error) {
  return ERROR_SET.has(error);
}

export function makeCancellationError(reason: string) {
  const error = new Error(reason);
  ERROR_SET.add(error);
  return error;
}

export const defaultThrowCancellationError = () => {
  throw makeCancellationError("cancelled");
};
