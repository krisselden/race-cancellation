// @ts-check
const {
  withRaceTimeout,
  cancellableRace,
  throwIfCancelled,
} = require("race-cancellation");

QUnit.module("withRaceTimeout", () => {
  QUnit.test("task success", async assert => {
    const { runTest } = createTimeoutTest(assert);

    const expected = new Date();
    await runTest({
      taskStart({ resolve }) {
        resolve(expected);
      },
    });

    assert.verifySteps([
      "begin await",
      "task started",
      `await returned: ${expected}`,
    ]);
  });

  QUnit.test("task error", async assert => {
    const { runTest } = createTimeoutTest(assert);

    const expected = new Date();
    await runTest({
      taskStart({ reject }) {
        reject(expected);
      },
    });

    assert.verifySteps([
      "begin await",
      "task started",
      `await threw: ${expected}`,
    ]);
  });

  QUnit.test("task timeout", async assert => {
    const { runTest } = createTimeoutTest(assert);

    await runTest({
      taskStart(_deferred) {
        // never resolve task
      },
    });

    assert.verifySteps([
      "begin await",
      "task started",
      "await threw: TimeoutError: task took longer than 10ms",
    ]);
  });

  QUnit.test("cancel before", async assert => {
    const { runTest, cancel } = createTimeoutTest(assert);

    cancel();

    await runTest({
      taskStart(_deferred) {
        // never resolve task
        assert.ok(false, "task should not start");
      },
    });

    assert.verifySteps([
      "begin await",
      "await threw: CancellationError: outer race cancelled",
    ]);
  });

  QUnit.test("cancel after", async assert => {
    const { runTest, cancel } = createTimeoutTest(assert);

    await runTest({
      taskStart(_deferred) {
        cancel();
        // never resolve task
      },
    });

    assert.verifySteps([
      "begin await",
      "task started",
      "await threw: CancellationError: outer race cancelled",
    ]);
  });
});

/**
 * @typedef {Object} Deferred
 * @property {(result: any) => void} resolve
 * @property {(reason?: any) => void} reject
 */

/**
 * @typedef {Object} TimeoutTestDelegate
 * @property {(taskDeferred: Deferred) => void} taskStart
 */

/**
 * @param {Assert} assert
 */
function createTimeoutTest(assert) {
  const [raceCancellation, cancel] = cancellableRace();

  /**
   * @param {TimeoutTestDelegate} delegate
   */
  async function runTest(delegate) {
    function task() {
      assert.step("task started");
      return new Promise((resolve, reject) => {
        delegate.taskStart({ resolve, reject });
      });
    }

    assert.step("begin await");
    try {
      const res = throwIfCancelled(
        await withRaceTimeout(innerRace => innerRace(task), 10)(
          raceCancellation
        )
      );
      assert.step(`await returned: ${res}`);
    } catch (e) {
      assert.step(`await threw: ${e}`);
    }
  }

  return {
    cancel: () => cancel("outer race cancelled"),
    runTest,
  };
}
