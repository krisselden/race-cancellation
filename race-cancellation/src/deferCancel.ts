import { CancelReason, RaceCancel, ResolveCancel } from "./interfaces.js";
import newRaceCancel from "./newRaceCancel.js";

/**
 * Create a tuple of raceCancel and cancel functions.
 *
 * @public
 */
export default function deferCancel(): [RaceCancel, ResolveCancel] {
  let cancelled = false;
  let onCancel: (() => void) | undefined;
  let cancelReason: CancelReason | undefined;
  const raceCancel = newRaceCancel(
    () => cancelled,
    (cancel) => (onCancel = cancel),
    () => cancelReason
  );
  const cancel: ResolveCancel = (reason) => {
    cancelled = true;
    cancelReason = reason;
    if (onCancel !== undefined) onCancel();
  };
  return [raceCancel, cancel];
}
