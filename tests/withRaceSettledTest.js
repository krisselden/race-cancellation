/** @type {import("assert")} */
const assert = require("assert");

const { throwIfCancelled, withRaceSettled } = require("./helper");

/**
 * @typedef {import("race-cancellation").RaceCancellation} RaceCancellation
 */

describe("withRaceSettled", () => {
  it("resolves with the result of the task", async () => {
    const expected = { result: "result" };

    const task = withRaceSettled(async () => expected);

    /** @type {unknown} */
    const actual = await task();

    assert.strictEqual(actual, expected);
  });

  it("rejects if task function rejects", async () => {
    const task = withRaceSettled(async () => {
      throw Error("some error");
    });
    try {
      await task();
      assert.ok(false, "did not reject with task error");
    } catch (e) {
      assert.equal(e.message, "some error");
    }
  });

  it("subtask is canceled if short-circuited Promise.all", async () => {
    /** @type {string[]} */
    const steps = [];
    const step = /** @param {string} step */ (step) => void steps.push(step);
    /**
     * @param {RaceCancellation} raceCancel
     */
    async function cancellableSubtask(raceCancel) {
      try {
        step("subtask: await raceCancel");
        throwIfCancelled(
          await raceCancel(
            () =>
              new Promise(() => {
                // never resolving promise
              })
          )
        );
        step("subtask: unreachable");
      } catch (e) {
        step(`subtask: error: ${e}`);
      } finally {
        step("subtask: finally");
      }
    }

    const task = withRaceSettled(async (raceExit) => {
      step(`task: await all`);

      await Promise.all([
        Promise.reject(new Error("some error")),
        cancellableSubtask(raceExit),
      ]);
      step(`task: unreachable`);
    });

    try {
      step(`await runTask`);
      await task();
    } catch (e) {
      step(`error: ${e}`);
    }

    // raceExit should finish out pending
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.deepEqual(steps, [
      "await runTask",
      "task: await all",
      "subtask: await raceCancel",
      "error: Error: some error",
      "subtask: error: ShortCircuitError: the task was short-circuited by another concurrent task winning a Promise.race or rejecting a Promise.all",
      "subtask: finally",
    ]);
  });
});
