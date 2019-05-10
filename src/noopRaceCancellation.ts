import { RaceCancellation, Task } from "./interfaces";

/**
 * Allows an async function to add raceCancellation as an optional param
 * in a backwards compatible way by using this as the default.
 */
const noopRaceCancellation: RaceCancellation = <Result>(
  task: Task<Result>
): Promise<Result> => Promise.resolve().then(task);

export default noopRaceCancellation;
