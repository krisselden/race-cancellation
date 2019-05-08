import { NewTimeout } from "./interfaces";

export type TimeoutID = unknown;

declare const setTimeout: (
  callback: () => void,
  miliseconds: number
) => TimeoutID;
declare const clearTimeout: (id: TimeoutID) => void;

/**
 * Default CreateTimeout implementation using setTimeout/clearTimeout, allows
 */
const newTimeoutDefault: NewTimeout = (() => {
  // setTimeout is not actually part of the script host definition
  // but the expectation is that if you are running on a host that
  // doesn't have setTimeout defined is that you do not rely on the
  // default
  if (typeof setTimeout !== "function") {
    return undefined as never;
  }

  function createTimeout(callback: () => void, miliseconds: number) {
    const id = setTimeout(callback, miliseconds);
    return () => clearTimeout(id);
  }

  return createTimeout;
})();

export default newTimeoutDefault;
