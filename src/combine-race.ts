import { Race } from "../interfaces";

export default function combineRace(
  outer: Race | undefined,
  inner: Race
): Race {
  return outer === undefined ? inner : task => outer(() => inner(task));
}
