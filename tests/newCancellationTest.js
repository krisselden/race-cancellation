const { newCancellation, isCancellation } = require("race-cancellation");

QUnit.module("newCancellation", () => {
  QUnit.test("works without args", async assert => {
    const cancellation = newCancellation();
    assert.ok(isCancellation(cancellation, "Cancellation"));
    assert.equal(cancellation.message, "the task was cancelled");
  });
});
