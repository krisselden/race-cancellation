import { Deferred, Resolve } from "../interfaces";
import once from "./once";

export default function deferred(): Deferred {
  let resolved = false;
  let onResolve: Resolve | undefined;
  return [
    once(() =>
      resolved
        ? Promise.resolve()
        : new Promise(resolve => {
            onResolve = resolve;
          })
    ),
    () => resolved,
    () => {
      if (resolved) {
        return;
      }
      resolved = true;
      if (onResolve !== undefined) {
        onResolve();
      }
    },
  ];
}
