/** @type {import("assert")} */
const assert = require("assert");

const { intoCancellationError, isCancellation } = require("./helper");

describe("intoCancellationError", () => {
  it("works without args", async () => {
    const cancellation = intoCancellationError();
    assert.ok(isCancellation(cancellation, "Cancellation"));
    assert.equal(cancellation.message, "the task was cancelled");
  });
});
