import { Race } from "../interfaces";
import defaultTimeoutHost from "./default-timeout-host";
import disposablePromise from "./disposable-promise";

/**
 * Cancellable promise of a timeout.
 *
 * ```js
 * await sleep(1000, raceCancel);
 * ```
 */
export default async function sleep(
  ms: number,
  raceCancel: Race,
  { setTimeout, clearTimeout } = defaultTimeoutHost
) {
  return disposablePromise<void>(resolve => {
    const id = setTimeout(resolve, ms);
    return () => clearTimeout(id);
  }, raceCancel);
}
