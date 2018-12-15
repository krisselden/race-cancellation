import { Race, TimeoutId } from "../interfaces";
import defaultTimeoutHost from "./default-timeout-host";

/**
 * Cancellable promise of a delay.
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
  let id: TimeoutId | undefined;
  try {
    const createTimeout = () =>
      new Promise<void>(resolve => {
        id = setTimeout(() => {
          resolve();
          id = undefined;
        }, ms);
      });
    return await raceCancel(createTimeout);
  } finally {
    if (id !== undefined) {
      clearTimeout(id);
    }
  }
}
