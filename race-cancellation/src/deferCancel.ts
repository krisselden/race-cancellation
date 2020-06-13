import { CancelReason, RaceCancelFn, ResolveCancelFn } from "./interfaces.js";
import newRaceCancel from "./newRaceCancel.js";

/**
 * Create a tuple of {@link RaceCancelFn} and {@link ResolveCancelFn} functions.
 *
 * @remarks
 * In general, it is better to use {@link race-cancellation#withCancel} to scope cancellation
 * to an async task so that the cancellation concern is cleaned up.
 *
 * If the cancellation concern will be GC'ed with the cancel already and no cleanup
 * needed like removing an event listener than this method can be simpler.
 * @public
 */
export default function deferCancel(): [RaceCancelFn, ResolveCancelFn] {
  let cancelled = false;
  let onCancel: (() => void) | undefined;
  let cancelReason: CancelReason | undefined;
  const raceCancel = newRaceCancel(
    () => cancelled,
    (cancel) => (onCancel = cancel),
    () => cancelReason
  );
  const cancel: ResolveCancelFn = (reason) => {
    cancelled = true;
    cancelReason = reason;
    if (onCancel !== undefined) onCancel();
  };
  return [raceCancel, cancel];
}
