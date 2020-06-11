import { CancelError } from "./interfaces.js";

export default function newCancelError(
  message = "The operation was cancelled"
): CancelError {
  const cancelError = new Error(message) as CancelError;
  cancelError.name = "CancelError";
  cancelError.isCancelled = true;
  return cancelError;
}
