import { RaceCancellation } from "../interfaces";

export function combineRace(
  a: RaceCancellation,
  b: RaceCancellation
): RaceCancellation {
  return async task => a(() => b(task));
}
