const { cancellableRace } = require("..");
const assert = require("assert");

describe("cancellableRace", () => {
  it("cancel before race already rejected promise", async () => {
    const [raceCancellation, cancel] = cancellableRace();

    cancel();
    const task = Promise.reject(new Error("failed task"));

    try {
      await raceCancellation(task);
      assert.fail("expected failure");
    } catch (e) {
      assert.equal(e.message, "failed task");
    }
  });
});
