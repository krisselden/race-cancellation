import {
  Cancellation,
  cancellationBrand,
  CancellationError,
  CancellationKind,
} from "./interfaces";
import isCancellation from "./isCancellation";

export default function intoCancellationError<Kind extends string>(
  cancelation: Cancellation<Kind>
): CancellationError;
export default function intoCancellationError<Kind extends string>(
  message?: string,
  kind?: Kind
): CancellationError;
export default function intoCancellationError(
  message?: string | Cancellation,
  kind?: string
): CancellationError<string> {
  if (isCancellation(message)) {
    return errorFromCancellation(message);
  }
  return newCancellationError(message, kind);
}

function errorFromCancellation(
  cancellation: Cancellation,
  name = `${cancellation[cancellationBrand].kind}Error`
): CancellationError<string> {
  const payload = cancellation[cancellationBrand];
  const error = new Error(payload.message) as CancellationError;
  error.name = name;
  error[cancellationBrand] = payload;
  return error;
}

function newCancellationError(
  message = "the task was cancelled",
  kind: string = CancellationKind.Cancellation,
  name = `${kind}Error`
): CancellationError<string> {
  const error = new Error(message) as CancellationError;
  error.name = name;
  error[cancellationBrand] = {
    kind,
    message,
  };
  return error;
}
