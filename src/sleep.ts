import defaultCreateTimeout from "./default-create-timeout";
import disposablePromise from "./disposable-promise";
import raceNoop from "./race-noop";

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
 * @param raceCancellation a function to race the waiting for the
 *                         timeout against a cancellation promise
 * @param createTimeout defaults to setTimeout/clearTimeout, allows you to provide other host for testing
 */
export default async function sleep(
  milliseconds: number,
  raceCancellation = raceNoop,
  createTimeout = defaultCreateTimeout
): Promise<void> {
  return disposablePromise<void>(
    resolve => createTimeout(resolve, milliseconds),
    raceCancellation
  );
}
