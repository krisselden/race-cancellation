export type Race = <Result>(
  task: Task<Result> | Promise<Result>
) => Promise<Result>;

export type Task<Result> = () => Promise<Result>;

export type CancellableTask<Result> = (
  raceCancellation: Race
) => Promise<Result>;

export type OptionallyCancellableTask<Result> = (
  raceCancellation?: Race
) => Promise<Result>;

export type Thunk<Value> = () => Value;

export type IsResolved = () => boolean;
export type Resolve = () => void;
export type Deferred = [Thunk<Promise<void>>, IsResolved, Resolve];

export type IsCancelled = () => boolean;
export type Cancel = () => void;
export type CancellableRace = [Race, Cancel];

export type Executor<Result> = (
  resolve: (value?: Result | PromiseLike<Result>) => void,
  reject: (reason?: any) => void
) => Dispose;

export type Dispose = () => void;

export type CreateTimeout = (callback: () => void, ms: number) => Dispose;

export type CancellationError = Error & { isCancellationError: true };
export type TimeoutError = CancellationError & { isTimeoutError: true };

export type CreateCancellationError = () => CancellationError;
