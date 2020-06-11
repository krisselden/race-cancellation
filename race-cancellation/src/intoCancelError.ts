import { CancelError, CancelReason } from "./interfaces.js";
import newCancelError from "./newCancelError.js";

export default function intoCancelError(
  cancelReason?: (() => CancelReason | undefined) | CancelReason
): CancelError<string> {
  if (typeof cancelReason === "function") {
    cancelReason = cancelReason();
  }
  if (cancelReason === undefined || typeof cancelReason === "string") {
    return newCancelError(cancelReason);
  }
  return cancelReason;
}
