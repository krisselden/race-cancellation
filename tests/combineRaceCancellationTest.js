const {
  combineRaceCancellation,
  cancellableRace,
  throwIfCancelled,
  noopRaceCancellation,
} = require("..");

const assert = require("assert");

describe("combineRaceCancellation", () => {
  it("calling combine with a & b both undefined", async () => {
    const raceCancellation = combineRaceCancellation(undefined, undefined);
    const expected = new Date();
    const actual = await raceCancellation(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("calling combine with b as undefined", async () => {
    const raceCancellation = combineRaceCancellation(
      noopRaceCancellation,
      undefined
    );
    const expected = new Date();
    const actual = await raceCancellation(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("calling combine with a as undefined", async () => {
    const raceCancellation = combineRaceCancellation(
      undefined,
      noopRaceCancellation
    );
    const expected = new Date();
    const actual = await raceCancellation(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("task success", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelA, cancelB } = createTest(step);

    const expected = new Date();
    await runTest({
      taskStart(deferred) {
        deferred.resolve(expected);
      },
    });

    cancelA();
    cancelB();

    assert.deepEqual(steps, [
      "begin await",
      "race A started",
      "race B started",
      "task started",
      `await returned: ${expected}`,
    ]);
  });

  it("task error", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelA, cancelB } = createTest(step);

    const expected = new Date();
    await runTest({
      taskStart(deferred) {
        deferred.reject(expected);
      },
    });

    cancelA();
    cancelB();

    assert.deepEqual(steps, [
      "begin await",
      "race A started",
      "race B started",
      "task started",
      `await threw: ${expected}`,
    ]);
  });

  it("cancel A before race", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelA } = createTest(step);

    cancelA();

    await runTest({
      taskStart() {
        assert.ok(false, "task should not start");
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race A started",
      "await threw: CancellationError: A cancelled",
    ]);
  });

  it("cancel A after race", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelA } = createTest(step);

    await runTest({
      taskStart() {
        cancelA();
        // never resolve task
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race A started",
      "race B started",
      "task started",
      "await threw: CancellationError: A cancelled",
    ]);
  });

  it("cancel B before race", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelB } = createTest(step);

    cancelB();

    await runTest({
      taskStart() {
        assert.ok(false, "task should not start");
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race A started",
      "race B started",
      "await threw: CancellationError: B cancelled",
    ]);
  });

  it("cancel B after race", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelB } = createTest(step);

    await runTest({
      taskStart() {
        cancelB();
        // never resolve task
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race A started",
      "race B started",
      "task started",
      "await threw: CancellationError: B cancelled",
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
    const { runTest, cancelA, cancelB } = createTest(step);

    const expected = new Date();

    await runTest({
      taskStart(deferred) {
        // tie should go to result
        cancelA();
        cancelB();
        deferred.resolve(expected);
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race A started",
      "race B started",
      "task started",
      `await returned: ${expected}`,
    ]);
  });

  it("tied with reject", async () => {
    const [step, steps] = createSteps();
    const { runTest, cancelA, cancelB } = createTest(step);

    const expected = new Date();

    await runTest({
      taskStart(deferred) {
        // tie should go to result
        cancelA();
        cancelB();
        deferred.reject(expected);
      },
    });

    assert.deepEqual(steps, [
      "begin await",
      "race A started",
      "race B started",
      "task started",
      `await threw: ${expected}`,
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
  const [raceA, cancelA] = cancellableRace();

  const [raceB, cancelB] = cancellableRace();

  /**
   * @param {TestDelegate} delegate
   */
  async function runTest(delegate) {
    const combinedRace = combineRaceCancellation(
      task => {
        step("race A started");
        return raceA(task);
      },
      task => {
        step("race B started");
        return raceB(task);
      }
    );
    try {
      step("begin await");
      const res = throwIfCancelled(
        await combinedRace(() => {
          step("task started");
          return new Promise((resolve, reject) => {
            delegate.taskStart({ resolve, reject });
          });
        })
      );
      step(`await returned: ${res}`);
    } catch (e) {
      step(`await threw: ${e}`);
    }
  }

  return {
    cancelA: () => cancelA("A cancelled"),
    cancelB: () => cancelB("B cancelled"),
    runTest: runTest,
  };
}

/**
 * @returns {[(step: string) => void, string[]]}
 */
function createSteps() {
  /** @type {string[]} */
  const steps = [];
  return [/** @param {string} step */ step => steps.push(step), steps];
}
