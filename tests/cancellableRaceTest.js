const { cancellableRace } = require("race-cancellation");

QUnit.module("cancellableRace", () => {
  QUnit.test("cancel before race already rejected promise", async assert => {
    assert.expect(1);

    const [raceCancellation, cancel] = cancellableRace();

    cancel();
    const task = Promise.reject(new Error("failed task"));

    try {
      await raceCancellation(task);
    } catch (e) {
      assert.equal(e.message, "failed task");
    }
  });
});
