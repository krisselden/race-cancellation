import { CreateTimeout } from "../interfaces";

declare const setTimeout: (callback: () => void, miliseconds: number) => {};
declare const clearTimeout: (id: {}) => void;

/**
 * Default CreateTimeout implementation using setTimeout/clearTimeout
 */
const defaultCreateTimeout: CreateTimeout = (() => {
  // setTimeout is not actually part of the script host definition
  // but the expectation is that if you are running on a host that
  // doesn't have setTimeout defined is that you do not rely on the
  // default
  if (typeof setTimeout !== "function") {
    return undefined as never;
  }

  function createTimeout(callback: () => void, miliseconds: number) {
    const id = setTimeout(callback, miliseconds);
    return clearTimeout.bind(null, id);
  }

  return createTimeout;
})();

export default defaultCreateTimeout;
