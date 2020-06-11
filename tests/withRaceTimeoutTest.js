const assert = require("assert");

const { cancellableRace, withRaceTimeout } = require("./helper");

describe("withRaceTimeout", () => {
  it("task success", async () => {
    const [step, steps] = createSteps();
    const { runTest } = createTimeoutTest(step);

    const expected = new Date();
    await runTest({
      taskStart({ resolve }) {
        resolve(expected);
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "task started",
      `await returned: ${expected}`,
    ]);
  });

  it("task error", async () => {
    const [step, steps] = createSteps();
    const { runTest } = createTimeoutTest(step);

    const expected = new Date();
    await runTest({
      taskStart({ reject }) {
        reject(expected);
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "task started",
      `await threw: ${expected}`,
    ]);
  });

  it("task timeout", async () => {
    const [step, steps] = createSteps();
    const { runTest } = createTimeoutTest(step);

    await runTest({
      taskStart() {
        // never resolve task
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "task started",
      "await threw: TimeoutError: The operation timed out after taking longer than 10ms",
    ]);
  });

  it("cancel before", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancel } = createTimeoutTest(step);

    cancel();

    await runTest({
      taskStart() {
        // never resolve task
        assert.fail("task should not start");
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "await threw: CancelError: outer race cancelled",
    ]);
  });

  it("cancel after", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancel } = createTimeoutTest(step);

    await runTest({
      taskStart() {
        cancel();
        // never resolve task
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "task started",
      "await threw: CancelError: outer race cancelled",
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
 * @param {(step: string) => void} step
 */
function createTimeoutTest(step) {
  const [raceCancellation, cancel] = cancellableRace();

  /**
   * @param {TimeoutTestDelegate} delegate
   */
  async function runTest(delegate) {
    function task() {
      step("task started");
      return new Promise((resolve, reject) => {
        delegate.taskStart({ resolve, reject });
      });
    }

    step("begin await");
    try {
      const res = await withRaceTimeout(
        (innerRace) => innerRace(task),
        10
      )(raceCancellation);
      step(`await returned: ${res}`);
    } catch (e) {
      step(`await threw: ${e}`);
    }
  }

  return {
    cancel: () => cancel("outer race cancelled"),
    runTest,
  };
}

/**
 * @returns {[(step: string) => void, string[]]}
 */
function createSteps() {
  /** @type {string[]} */
  const steps = [];
  return [/** @param {string} step */ (step) => steps.push(step), steps];
}
