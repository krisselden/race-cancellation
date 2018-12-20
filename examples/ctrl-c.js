const {
  cancellableRace,
  cancellationError,
  run,
  sleep,
} = require("race-cancellation");

/** @typedef {import("race-cancellation").Race} Race */

const throwInterrupt = () => {
  throw cancellationError("SIGINT");
};

const [raceInterrupt, onInterrupt] = cancellableRace(throwInterrupt);

run(main, raceInterrupt).catch(e => {
  console.error(e);
  process.exitCode = 1;
});

process.on("SIGINT", onInterrupt);

/**
 * main cancellable async task
 * @param {Race} raceCancellation
 */
async function main(raceCancellation) {
  try {
    console.log("main start");
    for (let i = 0; i < 8; i++) {
      await sleep(1000, raceCancellation);
      console.log(i + 1);
    }
    console.log("main done");
  } catch (e) {
    throw new Error(`main error: ${e.stack}`);
  } finally {
    console.log("main finally");
  }
}
