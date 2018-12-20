const {
  cancellableRace,
  cancellationError,
  run,
  sleep,
} = require("race-cancellation");

/** @typedef {import("race-cancellation").Race} Race */

const [raceInterrupt, onInterrupt] = cancellableRace(() => {
  throw cancellationError("SIGINT");
});

process.on("SIGINT", onInterrupt);

run(main, raceInterrupt);

/**
 * cancellable async main with graceful termination on cancel.
 * @param {Race} raceCancellation
 */
async function main(raceCancellation) {
  console.log("main started");
  try {
    const result = await doSomeAsyncTask((step, total) => {
      console.log(`main progress: ${step} of ${total}`);
    }, raceCancellation);
    console.log(`main done: ${result}`);
  } catch (e) {
    console.error(e.stack);
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
async function doSomeAsyncTask(progress, raceCancellation) {
  try {
    for (let i = 0; i < 8; i++) {
      await sleep(1000, raceCancellation);
      progress(i + 1, 8);
    }
  } catch (e) {
    throw new Error(`doSomeAsyncThing failed: ${e.message}`);
  }
  return "some result";
}
