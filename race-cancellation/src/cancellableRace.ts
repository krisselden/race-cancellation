import {
  Cancel,
  Cancellation,
  IntoCancellation,
  RaceCancellation,
} from "./interfaces";
import isCancellation from "./isCancellation.js";
import newCancellation from "./newCancellation.js";
import newRaceCancellation from "./newRaceCancellation.js";
import oneshot from "./oneshot.js";

/**
 * Returns a tuple of a `RaceCancellation` with a function that resolves the cancellation.
 *
 * @param intoCancellation a function that transforms the cancellation result into a cancellation.
 */
export default function cancellableRace<CancellationResult>(
  intoCancellation: IntoCancellation<CancellationResult>
): [RaceCancellation, (result: CancellationResult) => void];

/**
 * Returns a tuple of a `RaceCancellation` with a function that resolves the cancellation.
 */
export default function cancellableRace(): [RaceCancellation, Cancel];
export default function cancellableRace<CancellationResult = Cancellation>(
  intoCancellation?: IntoCancellation<CancellationResult>
): [RaceCancellation, ((result: CancellationResult) => void) | Cancel] {
  if (intoCancellation === undefined) {
    return cancellableRaceWithCancel();
  } else {
    return cancellableRaceWithIntoCancellation(intoCancellation);
  }
}

export function cancellableRaceWithCancel(): [RaceCancellation, Cancel] {
  const [cancellation, resolve] = oneshot<Cancellation>();
  const raceCancellation = newRaceCancellation(cancellation);
  return [raceCancellation, cancel];

  function cancel(
    messageOrCancellation?: string | Cancellation,
    kind?: string
  ): void {
    if (isCancellation(messageOrCancellation)) {
      resolve(messageOrCancellation);
    } else {
      resolve(newCancellation(kind, messageOrCancellation));
    }
  }
}

export function cancellableRaceWithIntoCancellation<CancellationResult>(
  intoCancellation: IntoCancellation<CancellationResult>
): [RaceCancellation, (result: CancellationResult) => void] {
  const [cancellation, cancel] = oneshot<CancellationResult>();
  const raceCancellation = newRaceCancellation(cancellation, intoCancellation);
  return [raceCancellation, cancel];
}
