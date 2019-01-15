// @ts-check
const { combineRace, cancellableRace } = require("race-cancellation");

QUnit.module("combineRace and cancellableRace", () => {
  QUnit.test("task success", async (assert) => {
    const { run, cancelA, cancelB } = createTest(
      step => assert.step(step)
    );

    const expected = new Date();
    await run(resolve => resolve(expected));

    cancelA();
    cancelB();

    assert.verifySteps([
      "await",
      "race A",
      "race B",
      "task",
      `return: ${expected}`
    ]);
  });

  QUnit.test("task error", async (assert) => {
    const { run, cancelA, cancelB } = createTest(
      step => assert.step(step)
    );

    const expected = new Date();
    await run((_, reject) => reject(expected));

    cancelA();
    cancelB();

    assert.verifySteps([
      "await",
      "race A",
      "race B",
      "task",
      `error: ${expected}`
    ]);
  });

  QUnit.test("cancel A before race", async (assert) => {
    const { run, cancelA } = createTest(
      step => assert.step(step)
    );

    cancelA();

    await run();

    assert.verifySteps([
      "await",
      "race A",
      "error: A cancelled"
    ]);
  });

  QUnit.test("cancel A after race", async (assert) => {
    const { run, cancelA } = createTest(
      step => assert.step(step)
    );

    let runPromise;

    let taskPromise = new Promise(resolve => {
      runPromise = run(resolve);
    });

    await taskPromise;

    cancelA();

    await runPromise;

    assert.verifySteps([
      "await",
      "race A",
      "race B",
      "task",
      "error: A cancelled"
    ]);
  });

  QUnit.test("cancel B before race", async (assert) => {
    const { run, cancelB } = createTest(
      step => assert.step(step)
    );

    cancelB();

    await run();

    assert.verifySteps([
      "await",
      "race A",
      "race B",
      "error: B cancelled"
    ]);
  });

  QUnit.test("cancel B after race", async (assert) => {
    const { run, cancelB } = createTest(
      step => assert.step(step)
    );

    let runPromise;

    let taskPromise = new Promise(resolve => {
      runPromise = run(resolve);
    });

    await taskPromise;

    cancelB();

    await runPromise;

    assert.verifySteps([
      "await",
      "race A",
      "race B",
      "task",
      "error: B cancelled"
    ]);
  });

  QUnit.test("tied with resolve", async (assert) => {
    const { run, cancelA, cancelB } = createTest(
      step => assert.step(step)
    );

    const expected = new Date();

    await run((resolve) => {
      // tie should go to result
      cancelA();
      cancelB();
      resolve(expected);
    });

    assert.verifySteps([
      "await",
      "race A",
      "race B",
      "task",
      `return: ${expected}`
    ]);
  });

  QUnit.test("tied with reject", async (assert) => {
    const { run, cancelA, cancelB } = createTest(
      step => assert.step(step)
    );

    const expected = new Date();

    await run((_, reject) => {
      // tie should go to result
      cancelA();
      cancelB();
      reject(expected);
    });

    assert.verifySteps([
      "await",
      "race A",
      "race B",
      "task",
      `error: ${expected}`
    ]);
  });

});

/**
 * @param {(label: string) => void} step
 */
function createTest(step) {
  const [raceA, cancelA] = cancellableRace(() => {
    throw "A cancelled";
  });

  const [raceB, cancelB] = cancellableRace(() => {
    throw "B cancelled";
  });

  /**
   * @param {(resolve: (result: any) => void, reject: (reason?: any) => void) => void} taskCallback
   */
  async function run(taskCallback = () => {
    throw Error("task was run unexpectedly")
  }) {
    const combinedRace = combineRace(task => {
      step("race A");
      return raceA(task);
    }, task => {
      step("race B");
      return raceB(task);
    });
    try {
      step("await");
      let res = await combinedRace(() => {
        step("task");
        return new Promise(taskCallback);
      });
      step(`return: ${res}`);
    } catch (e) {
      step(`error: ${e}`);
    }
  }

  return {
    cancelA,
    cancelB,
    run,
  }
}
