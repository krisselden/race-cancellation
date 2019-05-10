const {
  combineRaceCancellation,
  cancellableRace,
  throwIfCancelled,
} = require("race-cancellation");

QUnit.module("combineRaceCancellation", () => {
  QUnit.test("calling combine with a & b both undefined", async assert => {
    const raceCancellation = combineRaceCancellation(undefined, undefined);
    const expected = new Date();
    const actual = await raceCancellation(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  QUnit.test("calling combine with b as undefined", async assert => {
    const raceCancellation = combineRaceCancellation(
      task => Promise.resolve().then(task),
      undefined
    );
    const expected = new Date();
    const actual = await raceCancellation(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  QUnit.test("calling combine with a as undefined", async assert => {
    const raceCancellation = combineRaceCancellation(undefined, task =>
      Promise.resolve().then(task)
    );
    const expected = new Date();
    const actual = await raceCancellation(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

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
      "await threw: CancellationError: A cancelled",
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
      "await threw: CancellationError: A cancelled",
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
      "await threw: CancellationError: B cancelled",
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
  const [raceA, cancelA] = cancellableRace();

  const [raceB, cancelB] = cancellableRace();

  /**
   * @param {TestDelegate} delegate
   */
  async function runTest(delegate) {
    const combinedRace = combineRaceCancellation(
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
      let res = throwIfCancelled(
        await combinedRace(() => {
          assert.step("task started");
          return new Promise((resolve, reject) => {
            delegate.taskStart({ resolve, reject });
          });
        })
      );
      assert.step(`await returned: ${res}`);
    } catch (e) {
      assert.step(`await threw: ${e}`);
    }
  }

  return {
    cancelA: () => cancelA("A cancelled"),
    cancelB: () => cancelB("B cancelled"),
    runTest: runTest,
  };
}
