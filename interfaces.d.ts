export type Task<T> = () => Promise<T>;

export type RaceCancellation = {
  <T>(task: Promise<T> | Task<T>): Promise<T>;
};

export type CancellableTask<T> = (
  raceCancellation: RaceCancellation
) => Promise<T>;
