import { TimeoutError } from "./interfaces.js";

export default function newTimeoutError(milliseconds: number): TimeoutError {
  const timeoutError = new Error(
    `The operation timed out after taking longer than ${milliseconds}ms`
  ) as TimeoutError;
  timeoutError.name = "TimeoutError";
  timeoutError.isCancelled = true;
  timeoutError.isTimeout = true;
  return timeoutError;
}
