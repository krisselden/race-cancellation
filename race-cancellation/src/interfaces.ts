/**
 * An async function.
 * @public
 */
export type AsyncFn<TResult> = () => PromiseLike<TResult>;

/**
 * A function that builds a race against a cancel rejection.
 *
 * @remarks
 * If the task is a function, the expectation is it will not be called
 * if already in a cancelled state. Thus it should not close over any
 * floating promises, in general it should just create a new promise,
 * if it uses a cached promise it should have been already chained
 * to something that handles its rejection.
 *
 * This method can also take a promise and it will always race it even
 * if already in a cancelled state so if the promise fails it will not
 * cause an unhandled rejection.
 *
 * Calling this function is infallible (it wont fail to return a Promise
 * to be awaited).
 *
 * @param asyncFnOrPromise - a {@link AsyncFn} function to start an async operation or a promise.
 * @public
 */
export type RaceCancelFn = <TResult>(
  asyncFnOrPromise: AsyncFn<TResult> | PromiseLike<TResult>
) => Promise<TResult>;

/**
 * The Error interface for cancellation rejection.
 * @public
 */
export interface CancelError<TName extends string = "CancelError">
  extends Error {
  name: TName;
  isCancelled: true;
}

/**
 * The Error interface for {@link withTimeout} if the timeout wins the race.
 * @public
 */
export interface TimeoutError<TName extends string = "TimeoutError">
  extends CancelError<TName> {
  isTimeout: true;
}

/**
 * A cancellable async function.
 * @param raceCancel - a {@link RaceCancelFn}.
 * @public
 */
export type CancellableAsyncFn<TResult> = (
  raceCancel: RaceCancelFn
) => Promise<TResult>;

/**
 * A cleanup function that should be idempotent and infallible.
 * @public
 */
export type DisposeFn = () => void;

/**
 * A promise executor that returns a {@link DisposeFn} function.
 *
 * @remarks
 *
 * For example, if it is the promise of a setTimeout, should call clearTimeout.
 *
 * If it resolves on an event listener, it should uninstall the event listener.
 * @public
 */
export type DisposableExecutorFn<TResult> = (
  resolve: (value?: TResult | PromiseLike<TResult>) => void,
  reject: (reason?: unknown) => void
) => DisposeFn;

/**
 * A {@link CancelError} or `string` that is the cancellation reason.
 * @public
 */
export type CancelReason = CancelError<string> | string;

/**
 * A function that resolves the cancellation for deferCancel or withCancel.
 * @public
 */
export type ResolveCancelFn = (reason?: CancelReason) => void;

/**
 * A executor function for the cancellation concern that can resolve with a reason
 * and can return a cleanup function.
 * @public
 */
export type DisposableCancelExecutorFn = (
  resolve: ResolveCancelFn
) => DisposeFn;

/**
 * An accessor function for checking cancelled state.
 * @public
 */
export type IsCancelledFn = () => boolean;

/**
 * A executor function for the cancellation.
 * @public
 */
export type CancelExecutorFn = (resolve: () => void) => void;
