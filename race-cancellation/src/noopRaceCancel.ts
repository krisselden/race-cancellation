import { AsyncFn, RaceCancelFn } from "./interfaces.js";

/**
 * A no-op implemenation of a {@link RaceCancelFn} function.
 *
 * @remarks
 * Allows an async function to add cancellation support in a backwards compatible way by
 * adding optional param by providing this as a default.
 *
 * @param asyncFnOrPromise - an {@link AsyncFn} or `PromiseLike` that will be resolved.
 * @public
 */
const noopRaceCancel: RaceCancelFn = <TResult>(
  asyncFnOrPromise: AsyncFn<TResult> | PromiseLike<TResult>
): Promise<TResult> =>
  typeof asyncFnOrPromise === "function"
    ? Promise.resolve().then(asyncFnOrPromise)
    : Promise.resolve(asyncFnOrPromise);

export default noopRaceCancel;
