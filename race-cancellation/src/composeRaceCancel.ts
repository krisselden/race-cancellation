import { RaceCancelFn } from "./interfaces.js";
import noopRaceCancel from "./noopRaceCancel.js";

/**
 * Returns a {@link RaceCancelFn} function that is the composition of the two RaceCancel functions.
 *
 * @remarks
 * For convenience of writing methods that take cancellations, the params
 * are optional. If a is undefined, then b is retuned, if b is undefined then a
 * is returned, and if they both are undefined a noop race that just invokes
 * the task is returned.
 *
 * The outer scope function is expected to be a wider concern like ctrl-C and the inner a narrower
 * concern like timeout. This way if you catch a error then try to say sleep before a retrying the narrower
 * concern the outer will bail out without even starting the timeout because it is already cancelled.
 *
 * This isn't a hard requirement just things are optimized with that assunmption.
 *
 * @param inner - a {@link RaceCancelFn} function that is the inner function of the composition, in general its cancellation scope should be narrower than the outer scope.
 * @param outer - a {@link RaceCancelFn} function that is the outer function, its scope should be wider or equal to the inner scope.
 * @public
 */
export default function composeRaceCancel(
  inner?: RaceCancelFn,
  outer?: RaceCancelFn
): RaceCancelFn {
  return outer === undefined
    ? inner === undefined
      ? noopRaceCancel
      : inner
    : inner === undefined
    ? outer
    : (asyncFnOrPromise) =>
        typeof asyncFnOrPromise === "function"
          ? outer(() => inner(asyncFnOrPromise)) // lazy if function
          : outer(inner(asyncFnOrPromise));
}
