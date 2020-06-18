/** @type {import("assert")} */
const assert = require("assert");

const { withCancelPending } = require("./helper");

/**
 * @typedef {import("race-cancellation").RaceCancelFn} RaceCancelFn
 */

describe("withCancelPending", () => {
  it("resolves with the result of the task", async () => {
    const expected = { result: "result" };

    /** @type {unknown} */
    const actual = await withCancelPending(() => Promise.resolve(expected));

    assert.strictEqual(actual, expected);
  });

  it("rejects if task function rejects", async () => {
    try {
      await withCancelPending(() => {
        throw Error("some error");
      });
      assert.ok(false, "did not reject with task error");
    } catch (e) {
      assert.equal(e instanceof Error && e.message, "some error");
    }
  });

  it("subtask is canceled if short-circuited Promise.all", async () => {
    /** @type {string[]} */
    const steps = [];
    const step = /** @param {string} step */ (step) => void steps.push(step);
    /**
     * @param {RaceCancelFn} raceCancel
     */
    async function cancellableSubtask(raceCancel) {
      try {
        step("subtask: await raceCancel");
        await raceCancel(
          () =>
            new Promise(() => {
              // never resolving promise
            })
        );
        step("subtask: unreachable");
      } catch (e) {
        step(`subtask: error: ${String(e)}`);
      } finally {
        step("subtask: finally");
      }
    }

    try {
      step(`await runTask`);
      await withCancelPending(async (raceSettled) => {
        step(`task: await all`);

        await Promise.all([
          Promise.reject(new Error("some error")),
          cancellableSubtask(raceSettled),
        ]);
        step(`task: unreachable`);
      });
    } catch (e) {
      step(`error: ${String(e)}`);
    }

    // short circuited promises will be cancelled by the end of the microtask queue
    // we need to setTimeout to get beyond the current microtask flush
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.deepEqual(steps, [
      "await runTask",
      "task: await all",
      "subtask: await raceCancel",
      "error: Error: some error",
      "subtask: error: CancelError: The operation was cancelled because it was still pending when another concurrent promise either rejected in a Promise.all() or won in a Promise.race().",
      "subtask: finally",
    ]);
  });
});
