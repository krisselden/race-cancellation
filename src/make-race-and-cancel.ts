import { RaceCancellation } from "../interfaces";
import { defaultThrowCancellationError } from "./errors";
import { makeRace } from "./make-race";

export function makeRaceAndCancel(
  throwCancellationError = defaultThrowCancellationError
): [RaceCancellation, () => void] {
  let isCancelled = false;
  let cancelled: Promise<void> | undefined;
  let oncancel: (() => void) | undefined;

  return [
    makeRace(
      () => {
        if (cancelled === undefined) {
          if (isCancelled) {
            cancelled = Promise.resolve();
          } else {
            cancelled = new Promise(resolve => {
              oncancel = resolve;
            });
          }
        }
        return cancelled;
      },
      throwCancellationError,
      () => isCancelled
    ),
    () => {
      isCancelled = true;
      if (oncancel !== undefined) {
        oncancel();
      }
    }
  ];
}
