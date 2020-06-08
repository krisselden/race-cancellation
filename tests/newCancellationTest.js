const assert = require("assert");

const { newCancellation, isCancellation } = require("..");

describe("newCancellation", () => {
  it("works without args", async () => {
    const cancellation = newCancellation();
    assert.ok(isCancellation(cancellation, "Cancellation"));
    assert.equal(cancellation.message, "the task was cancelled");
  });
});
