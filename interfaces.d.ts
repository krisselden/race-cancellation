export type Race = <Result>(
  task: Promise<Result> | Task<Result>
) => Promise<Result>;
export type Task<Result> = () => Promise<Result>;

export type CancellableTask<Result> = (
  raceCancellation: Race
) => Promise<Result>;

export type CancellableRace = [Race, Cancel];
export type Cancel = () => void;

export type Executor<Result> = (
  resolve: Resolve<Result>,
  reject: Reject
) => Dispose;
export type Dispose = () => void;
export type Resolve<Result> = (value?: Result | PromiseLike<Result>) => void;
export type Reject = (reason?: any) => void;

export interface TimeoutHost {
  setTimeout(callback: () => void, ms: number): TimeoutId;
  clearTimeout(id: TimeoutId): void;
}
export type TimeoutId = {};
