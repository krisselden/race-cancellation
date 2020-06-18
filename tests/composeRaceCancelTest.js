/** @type {import("assert")} */
const assert = require("assert");

const { deferCancel, composeRaceCancel, noopRaceCancel } = require("./helper");

describe("composeRaceCancel", () => {
  it("calling combine with a & b both undefined", async () => {
    const raceCancel = composeRaceCancel(undefined, undefined);
    const expected = new Date();
    const actual = await raceCancel(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("calling combine with b as undefined", async () => {
    const raceCancel = composeRaceCancel(noopRaceCancel, undefined);
    const expected = new Date();
    const actual = await raceCancel(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("calling combine with a as undefined", async () => {
    const raceCancel = composeRaceCancel(undefined, noopRaceCancel);
    const expected = new Date();
    const actual = await raceCancel(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("task success", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelOuter, cancelInner } = createTest(step);

    const expected = new Date().toString();
    await runTest({
      taskStart(deferred) {
        deferred.resolve(expected);
      },
    });

    cancelOuter();
    cancelInner();

    assert.deepEqual(steps, [
      "begin await",
      "race Outer started",
      "race Inner started",
      "task started",
      `await returned: ${expected}`,
    ]);
  });

  it("task error", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelOuter, cancelInner } = createTest(step);

    const expected = new Date().toString();
    await runTest({
      taskStart(deferred) {
        deferred.reject(expected);
      },
    });

    cancelOuter();
    cancelInner();

    assert.deepEqual(steps, [
      "begin await",
      "race Outer started",
      "race Inner started",
      "task started",
      `await threw: ${expected}`,
    ]);
  });

  it("cancel Outer before race", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelOuter } = createTest(step);

    cancelOuter();

    await runTest({
      taskStart() {
        assert.ok(false, "task should not start");
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race Outer started",
      "await threw: CancelError: Outer cancelled",
    ]);
  });

  it("cancel Outer after race", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelOuter } = createTest(step);

    await runTest({
      taskStart() {
        cancelOuter();
        // never resolve task
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race Outer started",
      "race Inner started",
      "task started",
      "await threw: CancelError: Outer cancelled",
    ]);
  });

  it("cancel Inner before race", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelInner } = createTest(step);

    cancelInner();

    await runTest({
      taskStart() {
        assert.ok(false, "task should not start");
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race Outer started",
      "race Inner started",
      "await threw: CancelError: Inner cancelled",
    ]);
  });

  it("cancel Inner after race", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelInner } = createTest(step);

    await runTest({
      taskStart() {
        cancelInner();
        // never resolve task
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race Outer started",
      "race Inner started",
      "task started",
      "await threw: CancelError: Inner cancelled",
    ]);
  });

  // these test ensure that raceCancellation implementation
  // doesn't any more inbetween the Promise.race, this allows
  // allows the task promise b's Promise.race() in `a(() => b(task))` combine
  // to win in a's Promise.race.
  //
  // Promise.race([a, Promise.race([b, task])]) will combine to one race,
  // but Promise.race([a,Promise.resolve().then(() => Promise.race([b, task]))])
  // is not able to win a tie of them resolving at the same time.
  it("tied with resolve", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelOuter, cancelInner } = createTest(step);

    const expected = new Date();

    await runTest({
      taskStart(deferred) {
        deferred.resolve(expected);
        cancelOuter();
        cancelInner();
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race Outer started",
      "race Inner started",
      "task started",
      `await threw: CancelError: Outer cancelled`,
    ]);
  });

  it("tied with reject", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelOuter, cancelInner } = createTest(step);

    const expected = new Date();

    await runTest({
      taskStart(deferred) {
        deferred.reject(expected);
        cancelOuter();
        cancelInner();
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race Outer started",
      "race Inner started",
      "task started",
      `await threw: CancelError: Outer cancelled`,
    ]);
  });
});

/**
 * @typedef {Object} Deferred
 * @property {(result: any) => void} resolve
 * @property {(reason?: any) => void} reject
 */

/**
 * @typedef {Object} TestDelegate
 * @property {(taskDeferred: Deferred) => void} taskStart
 */

/**
 * @param {(step: string) => void} step
 */
function createTest(step) {
  const [raceOuter, cancelOuter] = deferCancel();

  const [raceInner, cancelInner] = deferCancel();

  /**
   * @param {TestDelegate} delegate
   */
  async function runTest(delegate) {
    const combinedRace = composeRaceCancel(
      (task) => {
        step("race Inner started");
        return raceInner(task);
      },
      (task) => {
        step("race Outer started");
        return raceOuter(task);
      }
    );
    try {
      step("begin await");
      const res = await combinedRace(() => {
        step("task started");
        return /** @type {Promise<unknown>} */ (new Promise(
          (resolve, reject) => {
            delegate.taskStart({ resolve, reject });
          }
        ));
      });
      step(`await returned: ${String(res)}`);
    } catch (e) {
      step(`await threw: ${String(e)}`);
    }
  }

  return {
    cancelOuter: () => cancelOuter("Outer cancelled"),
    cancelInner: () => cancelInner("Inner cancelled"),
    runTest: runTest,
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
