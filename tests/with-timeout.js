const { run, withTimeout, cancellableRace } = require("race-cancellation");

QUnit.module("run withTimeout", () => {
  QUnit.test("task success", async (assert) => {
    const { runTest } = createTest(
      step => assert.step(step)
    );

    const expected = new Date();
    await runTest(resolve => resolve(expected));

    assert.verifySteps([
      "await",
      "task",
      `return: ${expected}`
    ]);
  });

  QUnit.test("task error", async (assert) => {
    const { runTest } = createTest(
      step => assert.step(step)
    );

    const expected = new Date();
    await runTest((_, reject) => reject(expected));

    assert.verifySteps([
      "await",
      "task",
      `error: ${expected}`
    ]);
  });

  QUnit.test("task timeout", async (assert) => {
    const { runTest } = createTest(
      step => assert.step(step)
    );

    let promise = runTest(() => {
      // never resolve
    });

    await promise;

    assert.verifySteps([
      "await",
      "task",
      `error: Error: timed-out`
    ]);
  });

  QUnit.test("cancel before", async (assert) => {
    const { runTest, cancel } = createTest(
      step => assert.step(step)
    );

    cancel();

    await runTest(() => {
      // never resolve
    });

    assert.verifySteps([
      "await",
      "error: outer race cancelled"
    ]);
  });

  QUnit.test("cancel after", async (assert) => {
    const { runTest, cancel } = createTest(
      step => assert.step(step)
    );

    await runTest(() => {
      cancel();
      // never resolve task
    });

    assert.verifySteps([
      "await",
      "task",
      "error: outer race cancelled"
    ]);
  });
});

/**
 * @param {(label: string) => void} step
 */
function createTest(step) {
  const [raceCancellation, cancel] = cancellableRace(() => {
    throw "outer race cancelled"
  });

  /**
   * @param {(resolve: (result: any) => void, reject: (reason?: any) => void) => void} taskCallback
   */
  async function runTest(taskCallback = () => {
    throw Error("task was run unexpectedly")
  }) {
    function task() {
      step("task");
      return new Promise(taskCallback);
    }

    try {
      step("await");
      let res = await run(
        withTimeout(
          innerRace => innerRace(task),
          10
        ),
        raceCancellation
      );
      step(`return: ${res}`);
    } catch (e) {
      step(`error: ${e}`);
    }
  }

  return {
    cancel,
    runTest
  }
}
