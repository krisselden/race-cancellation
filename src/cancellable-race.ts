import { CancellableRace, CreateCancellationError } from "../interfaces";
import deferred from "./deferred";
import createRaceCancellation from "./race-cancellation";

/**
 * Returns a tuple of a Race with a cancel function that cancels it.
 * @param cancellationError optional function to create the cancellation error.
 */
export default function cancellableRace(
  cancellationError?: CreateCancellationError
): CancellableRace {
  const [cancellation, isCancelled, cancel] = deferred();
  const raceCancellation = createRaceCancellation(
    cancellation,
    isCancelled,
    cancellationError
  );
  return [raceCancellation, cancel];
}
