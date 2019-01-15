// @ts-check
const { combineRace, cancellableRace } = require("race-cancellation");

QUnit.module("combineRace", () => {
  QUnit.test("task success", async assert => {
    const { runTest, cancelA, cancelB } = createTest(assert);

    const expected = new Date();
    await runTest({
      taskStart(deferred) {
        deferred.resolve(expected);
      },
    });

    cancelA();
    cancelB();

    assert.verifySteps([
      "begin await",
      "race A started",
      "race B started",
      "task started",
      `await returned: ${expected}`,
    ]);
  });

  QUnit.test("task error", async assert => {
    const { runTest, cancelA, cancelB } = createTest(assert);

    const expected = new Date();
    await runTest({
      taskStart(deferred) {
        deferred.reject(expected);
      },
    });

    cancelA();
    cancelB();

    assert.verifySteps([
      "begin await",
      "race A started",
      "race B started",
      "task started",
      `await threw: ${expected}`,
    ]);
  });

  QUnit.test("cancel A before race", async assert => {
    const { runTest, cancelA } = createTest(assert);

    cancelA();

    await runTest({
      taskStart() {
        assert.ok(false, "task should not start");
      },
    });

    assert.verifySteps([
      "begin await",
      "race A started",
      "await threw: A cancelled",
    ]);
  });

  QUnit.test("cancel A after race", async assert => {
    const { runTest, cancelA } = createTest(assert);

    await runTest({
      taskStart() {
        cancelA();
        // never resolve task
      },
    });

    assert.verifySteps([
      "begin await",
      "race A started",
      "race B started",
      "task started",
      "await threw: A cancelled",
    ]);
  });

  QUnit.test("cancel B before race", async assert => {
    const { runTest, cancelB } = createTest(assert);

    cancelB();

    await runTest({
      taskStart() {
        assert.ok(false, "task should not start");
      },
    });

    assert.verifySteps([
      "begin await",
      "race A started",
      "race B started",
      "await threw: B cancelled",
    ]);
  });

  QUnit.test("cancel B after race", async assert => {
    const { runTest, cancelB } = createTest(assert);

    await runTest({
      taskStart() {
        cancelB();
        // never resolve task
      },
    });

    assert.verifySteps([
      "begin await",
      "race A started",
      "race B started",
      "task started",
      "await threw: B cancelled",
    ]);
  });

  QUnit.test("tied with resolve", async assert => {
    const { runTest, cancelA, cancelB } = createTest(assert);

    const expected = new Date();

    await runTest({
      taskStart(deferred) {
        // tie should go to result
        cancelA();
        cancelB();
        deferred.resolve(expected);
      },
    });

    assert.verifySteps([
      "begin await",
      "race A started",
      "race B started",
      "task started",
      `await returned: ${expected}`,
    ]);
  });

  QUnit.test("tied with reject", async assert => {
    const { runTest, cancelA, cancelB } = createTest(assert);

    const expected = new Date();

    await runTest({
      taskStart(deferred) {
        // tie should go to result
        cancelA();
        cancelB();
        deferred.reject(expected);
      },
    });

    assert.verifySteps([
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
 * @param {Assert} assert
 */
function createTest(assert) {
  const [raceA, cancelA] = cancellableRace(() => {
    throw "A cancelled";
  });

  const [raceB, cancelB] = cancellableRace(() => {
    throw "B cancelled";
  });

  /**
   * @param {TestDelegate} delegate
   */
  async function runTest(delegate) {
    const combinedRace = combineRace(
      task => {
        assert.step("race A started");
        return raceA(task);
      },
      task => {
        assert.step("race B started");
        return raceB(task);
      }
    );
    try {
      assert.step("begin await");
      let res = await combinedRace(() => {
        assert.step("task started");
        return new Promise((resolve, reject) => {
          delegate.taskStart({ resolve, reject });
        });
      });
      assert.step(`await returned: ${res}`);
    } catch (e) {
      assert.step(`await threw: ${e}`);
    }
  }

  return {
    cancelA,
    cancelB,
    runTest: runTest,
  };
}
