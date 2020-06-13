/** @type {import("assert")} */
const assert = require("assert");

const { deferCancel } = require("./helper");

describe("cancellableRace", () => {
  it("cancel before race already rejected promise", async () => {
    const [raceCancellation, cancel] = deferCancel();

    cancel();
    const task = Promise.reject(new Error("failed task"));

    try {
      await raceCancellation(task);
      assert.fail("expected failure");
    } catch (e) {
      assert.equal(e instanceof Error && e.message, "failed task");
    }
  });
});
