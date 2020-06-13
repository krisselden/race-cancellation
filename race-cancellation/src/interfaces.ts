/**
 * The default error thrown during from the Promise.race if the cancellation task wins.
 * @public
 */
export interface CancelError<TName extends string = "CancelError">
  extends Error {
  name: TName;
  isCancelled: true;
}

/**
 * @public
 */
export interface TimeoutError<TName extends string = "TimeoutError">
  extends CancelError<TName> {
  isTimeout: true;
}

/**
 * A function that builds a race against a cancel rejection.
 *
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
 * @param taskOrPromise - a function to start a task or a promise
 * @public
 */
export type RaceCancel = <TResult>(
  taskOrPromise: Task<TResult> | PromiseLike<TResult>
) => Promise<TResult>;

/**
 * An async task.
 * @public
 */
export type Task<TResult> = () => PromiseLike<TResult>;

/**
 * A cancellable async task.
 * @param raceCancel - a function to lazily build a promise race against cancel rejection.
 * @public
 */
export type CancellableTask<TResult> = (
  raceCancel: RaceCancel
) => Promise<TResult>;

/**
 * A cleanup function that should be idempotent and infallible.
 * @public
 */
export type Dispose = () => void;

/**
 * A promise executor that returns a {@link Dispose}.
 *
 * For example, if it is the promise of a setTimeout, should call clearTimeout.
 *
 * If it resolves on an event listener, it should uninstall the event listener.
 * @public
 */
export type DisposableExecutor<TResult> = (
  resolve: (value?: TResult | PromiseLike<TResult>) => void,
  reject: (reason?: unknown) => void
) => Dispose;

/**
 * A {@link CancelError} or `string` that is the cancellation reason.
 * @public
 */
export type CancelReason = CancelError<string> | string;

/**
 * @public
 */
export type ResolveCancel = (reason?: CancelReason) => void;

/**
 * @public
 */
export type DisposableCancelExecutor = (resolve: ResolveCancel) => Dispose;

/**
 * @public
 */
export type IsCancelled = () => boolean;

/**
 * @public
 */
export type CancelExecutor = (resolve: () => void) => void;
