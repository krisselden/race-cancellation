const assert = require("assert");

const { cancellableRace, isCancellation, throwIfCancelled } = require("..");

describe("throwIfCancelled", () => {
  it("error is itself a cancellation", async () => {
    const [raceCancellation, cancel] = cancellableRace();

    cancel();

    try {
      throwIfCancelled(
        await raceCancellation(
          () =>
            new Promise(() => {
              // no resolve
            })
        )
      );
      assert.fail("expected to fail");
    } catch (e) {
      assert.ok(isCancellation(e), "error is a cancellation");
    }
  });
});
