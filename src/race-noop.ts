import { Race, Task } from "../interfaces";

const raceNoop: Race = <Result>(
  task: Task<Result> | Promise<Result>
): Promise<Result> => (typeof task === "function" ? task() : task);

/**
 * Allows an async function to add raceCancellation param
 * in a backwards compat way by using this as the default.
 */
export default raceNoop;
