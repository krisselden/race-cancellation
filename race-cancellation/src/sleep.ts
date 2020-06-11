import disposablePromise from "./disposablePromise.js";
import newTimeout from "./newTimeout.js";
import noopRaceCancellation from "./noopRaceCancel.js";

/**
 * Cancellable promise of a timeout.
 *
 * If the cancellation wins the race the timeout will cleanup
 * (allowing node to exit for example).
 *
 * ```js
 * await sleep(1000, raceCancellation);
 * ```
 *
 * @param milliseconds timeout in milliseconds
 * @param raceCancellation a function to race the timeout promise against a
 *                         cancellation.
 * @param newTimeout defaults to setTimeout/clearTimeout
 *                   allows you to provide other implementation for testing
 */
export default async function sleep(
  milliseconds: number,
  raceCancellation = noopRaceCancellation
): Promise<void> {
  return disposablePromise(
    (resolve) => newTimeout(resolve, milliseconds),
    raceCancellation
  );
}
