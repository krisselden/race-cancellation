/** @type {import("race-cancellation")} */
let raceCancellation;

async function loadModule() {
  try {
    return (raceCancellation = await import("race-cancellation"));
  } catch {
    return (raceCancellation = require("race-cancellation"));
  }
}

const promise = loadModule();

before(() => promise);

/** @type {any} */
const proxy = new Proxy(promise, {
  get(target, prop) {
    const value = target[/** @type {keyof typeof target} */ (prop)];
    if (typeof value === "function") {
      return value.bind(target);
    }
    if (value !== undefined) {
      return value;
    }
    // if raceCancellation isn't loaded return a function
    // that will invoke it when it is
    if (raceCancellation === undefined) {
      return (/** @type {any[]} */ ...args) => {
        if (raceCancellation === undefined) {
          throw new Error(`race-cancellation not loaded yet`);
        }

        if (prop in raceCancellation) {
          /** @type {any} */
          const fn =
            raceCancellation[
              /** @type {keyof typeof raceCancellation} */ (prop)
            ];
          return fn(...args);
        }
      };
    }
    if (prop in raceCancellation) {
      return raceCancellation[
        /** @type {keyof typeof raceCancellation} */ (prop)
      ];
    }
    return value;
  },
});

module.exports = /** @type {typeof import("race-cancellation")} */ (proxy);
