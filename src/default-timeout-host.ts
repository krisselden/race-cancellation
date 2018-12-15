import { TimeoutHost, TimeoutId } from "../interfaces";

declare const setTimeout: (fn: () => void, ms: number) => TimeoutId;
declare const clearTimeout: (id: TimeoutId) => void;

const defaultTimeoutHost: TimeoutHost = (() => {
  // setTimeout is not actually part of the script host definition
  // but the expectation is that if you are running on a host that
  // doesn't have setTimeout defined is that you do not rely on the
  // default
  if (typeof setTimeout !== "function") {
    return undefined as never;
  }
  return { clearTimeout, setTimeout };
})();

export default defaultTimeoutHost;
