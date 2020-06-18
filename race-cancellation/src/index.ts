/**
 * A functional version of the cancellation token pattern for making cancellable async functions.
 * @remarks
 *
 * The {@link CancellableAsyncFn} takes a {@link RaceCancelFn} function that will build the cancellation race lazily.
 *
 * This avoids a number of issues around cleanup and unhandled rejections and as well as being easy to adapt other
 * cancellation implementations for interop.
 * @packageDocumentation
 */

export { default as cancellablePromise } from "./cancellablePromise.js";

export { default as withCancel } from "./withCancel.js";
export { default as deferCancel } from "./deferCancel.js";
export { default as withTimeout } from "./withTimeout.js";
export { default as withCancelPending } from "./withCancelPending.js";

export { default as composeRaceCancel } from "./composeRaceCancel.js";
export { default as noopRaceCancel } from "./noopRaceCancel.js";
export { default as newRaceCancel } from "./newRaceCancel.js";

export * from "./interfaces.js";
