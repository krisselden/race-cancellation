const {
  cancellableRace,
  cancellationError,
  disposablePromise,
} = require("race-cancellation");

/** @typedef {import("race-cancellation").Race} Race */

const [raceCancellation, cancel] = cancellableRace(() => {
  throw cancellationError("SIGINT");
});

process.on("SIGINT", cancel);

main();

/**
 * Cancellable async main with graceful termination on cancel.
 * @param {Race} raceCancellation
 */
async function main() {
  console.log("main started");
  try {
    const result = await doSomeAsyncTask((step, total) => {
      console.log(`main progress: ${step} of ${total}`);
    });
    console.log(`main done: ${result}`);
  } catch (e) {
    console.error(e.stack);
    // since cancellation runs finalizers for losing promise chain
    // we don't need to force node to exit.
    process.exitCode = 1;
  } finally {
    console.log("main finalized");
  }
}

/**
 * cancellable async work task
 * @param {(i: number, t: number) => void} progress
 * @param {Race} raceCancellation
 */
async function doSomeAsyncTask(progress) {
  try {
    for (let i = 0; i < 8; i++) {
      await doRealAsyncStep();
      progress(i + 1, 8);
    }
  } catch (e) {
    throw new Error(`doSomeAsyncThing failed: ${e.message}`);
  }
  return "some result";
}

/**
 * @param {Race} raceCancellation
 */
function doRealAsyncStep() {
  // `disposablePromise` is helper real async to
  // ensure cleanup on cancellation
  return disposablePromise(resolve => {
    const id = setTimeout(resolve, 1000);
    return () => {
      clearTimeout(id);
    };
  }, raceCancellation);
}
