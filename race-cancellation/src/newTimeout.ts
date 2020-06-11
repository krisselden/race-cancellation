import { Dispose } from "./interfaces.js";

export type TimeoutID = unknown;

declare const setTimeout: (
  callback: () => void,
  milliseconds: number
) => TimeoutID;
declare const clearTimeout: (id: TimeoutID) => void;

export default function newTimeout(
  callback: () => void,
  milliseconds: number
): Dispose {
  const id = setTimeout(callback, milliseconds);
  return () => clearTimeout(id);
}
