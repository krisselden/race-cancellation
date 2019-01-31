import { Race } from "../interfaces";

/**
 * Returns a Race that is the combination of two Race implemenations.
 *
 * The outer one is optionally to make it easy for a function to take a
 * optional Race and combine it.
 */
export default function combineRace(
  outer: Race | undefined,
  inner: Race
): Race {
  return outer === undefined ? inner : task => outer(() => inner(task));
}
