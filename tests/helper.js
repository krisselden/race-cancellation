/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/*
This helper module allows us to import from the module under test
while using the package conditional exports of "import" if supported
or falling back to package "main" if not supported.

Which lets us run the same test suite on both exports to ensure that
it works on Node < 12.17.0 or newer node using require or import.
*/

/** @type {{[prop: string]: unknown}} */
let raceCancellation;

async function loadModule() {
  try {
    return (raceCancellation = await import("race-cancellation"));
  } catch (e) {
    const [major, minor] = process.versions.node.split(".", 2).map(Number);
    if (major > 12 || (major === 12 && minor >= 17)) {
      // modules were enabled by default version >= 12.17
      // so if this failed there is a problem with the modules
      // most likely something didn't include the .js on the
      // import specifier.
      throw e;
    }
    // fallback to require export
    return (raceCancellation = require("race-cancellation"));
  }
}

// load test module and register before hook to wait for it
const promise = loadModule();
before(() => promise);

/** @type {any} */
const proxy = new Proxy(promise, {
  get(target, prop) {
    // proxy through to promise of module
    // mocha loadFilesAsync awaits module.exports
    if (prop in target) {
      const value = target[/** @type {keyof typeof target} */ (prop)];
      if (typeof value === "function") {
        // bind then, catch etc
        return value.bind(target);
      }
      return value;
    }
    // if possible export name then proxy to module
    if (typeof prop === "string") {
      // if not loaded return a function that will call it when invoked
      if (raceCancellation === undefined) {
        return (/** @type {any[]} */ ...args) => {
          if (raceCancellation === undefined) {
            // the before hook should have run unless this was called
            // outside of a test which isn't supported
            throw new Error(
              `race-cancellation not loaded yet, this function can only be inside of a test`
            );
          }
          const fn = raceCancellation[prop];
          if (typeof fn === "function") {
            return fn(...args);
          } else if (fn === undefined) {
            throw new Error(`${prop} is not exported by race-cancellation`);
          } else {
            throw new Error(`${prop} is not a function`);
          }
        };
      }
      // if loaded just return its value
      return raceCancellation[prop];
    }
  },
});

// export proxy
module.exports = /** @type {import("race-cancellation")} */ (proxy);
