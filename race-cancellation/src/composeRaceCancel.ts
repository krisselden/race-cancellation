import defaultRaceCancel from "./defaultRaceCancel.js";
import { RaceCancel } from "./interfaces.js";

/**
 * Returns a RaceCancel function that is the combination of two RaceCancel function.
 *
 * For convenience of writing methods that take cancellations, the params
 * are optional. If a is undefined, then b is retuned, if b is undefined then a
 * is returned, and if they both are undefined a noop race that just invokes
 * the task is returned.
 *
 * @public
 */
export default function composeRaceCancel(
  inner: RaceCancel | undefined,
  outer?: RaceCancel | undefined
): RaceCancel {
  return outer === undefined
    ? inner === undefined
      ? defaultRaceCancel
      : inner
    : inner === undefined
    ? outer
    : (task) => outer(() => inner(task));
}
