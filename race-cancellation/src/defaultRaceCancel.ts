import { RaceCancel, Task } from "./interfaces.js";

/**
 * Allows an async function to add raceCancellation as an optional param
 * in a backwards compatible way by using this as the default.
 *
 * @public
 */
const defaultRaceCancel: RaceCancel = <TResult>(
  task: Task<TResult> | PromiseLike<TResult>
): Promise<TResult> =>
  typeof task === "function"
    ? Promise.resolve().then(task)
    : Promise.resolve(task);

export default defaultRaceCancel;
