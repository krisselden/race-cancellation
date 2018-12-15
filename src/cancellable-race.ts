import { CancellableRace } from "../interfaces";
import raceCancellation from "./race-cancellation";

export default function cancellableRace(
  throwCancellationError?: () => never
): CancellableRace {
  let cancelled = false;
  let onCancel: (() => void) | undefined;
  let promise: Promise<void> | undefined;
  const lazyPromise = () => {
    if (promise === undefined) {
      if (cancelled) {
        promise = Promise.resolve();
      } else {
        promise = new Promise(resolve => {
          onCancel = resolve;
        });
      }
    }
    return promise;
  };
  const isCancelled = () => cancelled;
  const race = raceCancellation(
    lazyPromise,
    throwCancellationError,
    isCancelled
  );
  const cancel = () => {
    cancelled = true;
    if (onCancel !== undefined) {
      onCancel();
    }
  };
  return [race, cancel];
}
