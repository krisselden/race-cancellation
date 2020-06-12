import { cancellableRace, disposablePromise } from "race-cancellation";

const [raceCancellation, cancel] = cancellableRace();

process.on("SIGINT", cancel);

void main();

/**
 * Cancellable async main with graceful termination on cancel.
 */
async function main() {
  console.log("main started");
  try {
    const result = await myAsyncTask((step, total) => {
      console.log(`main progress: ${step} of ${total}`);
    });
    console.log(`main done: ${result}`);
  } catch (e) {
    console.error("%o", e);
    // let node exit naturally
    process.exitCode = 1;
  } finally {
    // do cleanup, like remove tmp files
    console.log("main finalized");
  }
}

/**
 * @param {(i: number, t: number) => void} progress
 */
async function myAsyncTask(progress) {
  for (let i = 0; i < 8; i++) {
    await doRealAsyncStep();
    progress(i + 1, 8);
  }
  return "some result";
}

async function doRealAsyncStep() {
  // `disposablePromise` is helper for real async to
  // ensure cleanup on cancellation
  await disposablePromise((resolve) => {
    const id = setTimeout(resolve, 1000);
    return () => {
      clearTimeout(id);
    };
  }, raceCancellation);
}
