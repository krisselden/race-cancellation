// @ts-check
const { runTask } = require("race-cancellation");

/**
 * @typedef {import("race-cancellation").RaceCancellation} RaceCancellation
 */

QUnit.module("runTask", () => {
  QUnit.test("resolves with the result of the task", async assert => {
    const expected = { result: "result" };

    const actual = await runTask(async () => expected);

    assert.strictEqual(actual, expected);
  });

  QUnit.test("rejects if task function rejects", async assert => {
    try {
      await runTask(async () => {
        throw Error("some error");
      });
      /* istanbul ignore next */
      assert.ok(false, "did not reject with task error");
    } catch (e) {
      assert.equal(e.message, "some error");
    }
  });

  QUnit.test(
    "subtask is canceled if short-circuited Promise.all",
    async assert => {
      /**
       * @param {RaceCancellation} raceCancel
       */
      async function cancellableSubtask(raceCancel) {
        try {
          assert.step("subtask: await raceCancel");
          await raceCancel(
            new Promise(() => {
              // never resolving promise
            })
          );
          /* istanbul ignore next */
          assert.step("subtask: unreachable");
        } catch (e) {
          assert.step(`subtask: error: ${e.message}`);
        } finally {
          assert.step("subtask: finally");
        }
      }

      try {
        assert.step(`await runTask`);
        await runTask(async raceExit => {
          assert.step(`task: await all`);

          await Promise.all([
            Promise.reject(new Error("some error")),
            cancellableSubtask(raceExit),
          ]);
          /* istanbul ignore next */
          assert.step(`task: unreachable`);
        });
      } catch (e) {
        assert.step(`error: ${e.message}`);
      }

      // raceExit should finish out pending
      await new Promise(resolve => setTimeout(resolve, 0));

      assert.verifySteps([
        "await runTask",
        "task: await all",
        "subtask: await raceCancel",
        "error: some error",
        "subtask: error: short-circuited",
        "subtask: finally",
      ]);
    }
  );
});
