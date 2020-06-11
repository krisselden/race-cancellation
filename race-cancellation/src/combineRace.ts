import { RaceCancel } from "./interfaces.js";
import noopRaceCancel from "./noopRaceCancel.js";

/**
 * Returns a RaceCancel function that is the combination of two RaceCancel function.
 *
 * For convenience of writing methods that take cancellations, the params
 * are optional. If a is undefined, then b is retuned, if b is undefined then a
 * is returned, and if they both are undefined a noop race that just invokes
 * the task is returned.
 */
export default function combineRace(
  outer: RaceCancel | undefined,
  inner: RaceCancel | undefined
): RaceCancel {
  return outer === undefined
    ? inner === undefined
      ? noopRaceCancel
      : inner
    : inner === undefined
    ? outer
    : (task) => outer(() => inner(task));
}
