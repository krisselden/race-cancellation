const { throwIfCancelled, withRaceSettled } = require("race-cancellation");

/**
 * @typedef {import("race-cancellation").RaceCancellation} RaceCancellation
 */

QUnit.module("withRaceSettled", () => {
  QUnit.test("resolves with the result of the task", async assert => {
    const expected = { result: "result" };

    const task = withRaceSettled(async () => expected);

    const actual = await task();

    assert.strictEqual(actual, expected);
  });

  QUnit.test("rejects if task function rejects", async assert => {
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

  QUnit.test(
    "subtask is canceled if short-circuited Promise.all",
    async assert => {
      /**
       * @param {RaceCancellation} raceCancel
       */
      async function cancellableSubtask(raceCancel) {
        try {
          assert.step("subtask: await raceCancel");
          throwIfCancelled(
            await raceCancel(
              () =>
                new Promise(() => {
                  // never resolving promise
                })
            )
          );
          assert.step("subtask: unreachable");
        } catch (e) {
          assert.step(`subtask: error: ${e}`);
        } finally {
          assert.step("subtask: finally");
        }
      }

      const task = withRaceSettled(async raceExit => {
        assert.step(`task: await all`);

        await Promise.all([
          Promise.reject(new Error("some error")),
          cancellableSubtask(raceExit),
        ]);
        assert.step(`task: unreachable`);
      });

      try {
        assert.step(`await runTask`);
        await task();
      } catch (e) {
        assert.step(`error: ${e}`);
      }

      // raceExit should finish out pending
      await new Promise(resolve => setTimeout(resolve, 0));

      assert.verifySteps([
        "await runTask",
        "task: await all",
        "subtask: await raceCancel",
        "error: Error: some error",
        "subtask: error: ShortCircuitError: the task was short-circuited by another concurrent task winning a Promise.race or rejecting a Promise.all",
        "subtask: finally",
      ]);
    }
  );
});
