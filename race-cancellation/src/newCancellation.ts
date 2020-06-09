import {
  Cancellation as CancellationType,
  cancellationBrand,
  CancellationKind,
  CancellationPayload,
} from "./interfaces.js";

/**
 * Creates a new `Cancellation`.
 *
 * @param kind the cancellation kind
 * @param message the cancellation error message, defaults to "the task was cancelled"
 */
export default function newCancellation<Kind extends string>(
  kind: Kind,
  message?: string
): CancellationType<Kind>;

/**
 * Creates a new `Cancellation`.
 *
 * @param kind the cancellation kind
 * @param message the cancellation error message, defaults to "cancelled"
 */
export default function newCancellation(
  kind?: CancellationKind.Cancellation,
  message?: string
): CancellationType<CancellationKind.Cancellation>;

/**
 * Creates a new `Cancellation`.
 *
 * @param kind the cancellation kind, defaults to "Cancellation"
 * @param message the cancellation error message, defaults to "the task was cancelled"
 */
export default function newCancellation(
  kind?: string,
  message?: string
): CancellationType;

export default function newCancellation(
  kind: string = CancellationKind.Cancellation,
  message = "the task was cancelled"
): CancellationType {
  return {
    [cancellationBrand]: {
      kind,
      message,
    },
  };
}

class Cancellation implements CancellationType {
  public [cancellationBrand]: CancellationPayload;

  constructor(payload: CancellationPayload) {
    this[cancellationBrand] = payload;
  }

  public toString(): string {
    return this[cancellationBrand].message;
  }
}
