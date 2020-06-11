/**
 * The default error thrown during from the Promise.race if the cancellation task wins.
 */
export interface CancelError<TName extends string = "CancelError">
  extends Error {
  name: TName;
  isCancelled: true;
}

export interface TimeoutError<TName extends string = "TimeoutError">
  extends CancelError<TName> {
  isTimeout: true;
}

/**
 * Races the specified task against the cancellation.
 */
export type RaceCancel = <TResult>(
  taskOrPromise: Task<TResult> | PromiseLike<TResult>
) => Promise<TResult>;

/**
 * An async task.
 */
export type Task<TResult> = () => PromiseLike<TResult>;

/**
 * A cancellable async task.
 */
export type CancellableTask<TResult> = (
  raceCancel: RaceCancel
) => Promise<TResult>;

/**
 * A cancellable async task wrapped with a cancellation concern.
 *
 * Can be passed in an outer cancellation concern.
 */
export type TaskWithRaceCancel<TResult> = (
  raceCancel?: RaceCancel
) => Promise<TResult>;

/**
 * Runs cleanup should be idempotent and infallible.
 */
export type Dispose = () => void;

/**
 * A promise executor that can cleanup.
 *
 * For example, if it is the promise of a setTimeout, should call clearTimeout.
 *
 * If it resolves on an event listener, it should uninstall the event listener
 */
export type DisposableExecutor<TResult> = (
  resolve: (value?: TResult | PromiseLike<TResult>) => void,
  reject: (reason?: unknown) => void
) => Dispose;

export type CancelReason = CancelError<string> | string;

export type CancelCallback = (reason?: CancelReason) => void;

export type CancellationTask = (cancel: CancelCallback) => Dispose;

export type IsCancelled = () => boolean;

export type OnCancel = (callback: () => void) => void;
