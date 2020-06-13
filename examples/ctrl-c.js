import { disposablePromise, withDisposableCancel } from "race-cancellation";

// Graceful exit on SIGINT

void main();

/**
 * Run a cancellable task with cancellation on SIGINT.
 *
 * @template T
 * @param {import("race-cancellation").CancellableTask<T>} cancellableTask
 */
function withCtrlC(cancellableTask) {
  return withDisposableCancel(cancellableTask, (resolve) => {
    process.on("SIGINT", resolve);
    return () => process.off("SIGINT", resolve);
  });
}

process.stdout.setNoDelay(true);

/**
 * Cancellable async main with graceful termination on cancel.
 */
async function main() {
  console.log("main started");
  try {
    const result = await withCtrlC(async (raceCancel) => {
      for (let i = 0; i < 8; i++) {
        process.stdout.write(`waiting on step ${i + 1} of 8 …`);
        await doRealAsyncStep(raceCancel);
        process.stdout.write(` done.\n`);
      }
      return "some result";
    });
    console.log(`main done: ${result}`);
  } catch (e) {
    console.error("%o", e);
    // let node exit naturally
    process.exitCode = 1;
  } finally {
    // do cancellable async cleanup
    await withCtrlC(async (raceCancel) => {
      process.stdout.write(`cleaning up …`);
      await doRealAsyncStep(raceCancel);
      process.stdout.write(` done.\n`);
    });
  }
}

/**
 * @param {import("race-cancellation").RaceCancel} raceCancel
 */
function doRealAsyncStep(raceCancel) {
  return disposablePromise((resolve) => {
    const id = setTimeout(resolve, 1000);
    return () => {
      clearTimeout(id);
    };
  }, raceCancel);
}
