import { CancelCallback, CancelReason, RaceCancel } from "./interfaces.js";
import newRaceCancel from "./newRaceCancel.js";

/**
 * Create a tuple of raceCancel and cancel functions.
 */
export default function cancellableRace(): [RaceCancel, CancelCallback] {
  let cancelled = false;
  let onCancel: (() => void) | undefined;
  let cancelReason: CancelReason | undefined;
  const raceCancel = newRaceCancel(
    () => cancelled,
    (cancel) => (onCancel = cancel),
    () => cancelReason
  );
  const cancel: CancelCallback = (reason) => {
    cancelled = true;
    cancelReason = reason;
    if (onCancel !== undefined) onCancel();
  };
  return [raceCancel, cancel];
}
