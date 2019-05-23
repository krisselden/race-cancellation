const {
  cancellableRace,
  isCancellation,
  throwIfCancelled,
} = require("race-cancellation");

QUnit.module("throwIfCancelled", () => {
  QUnit.test("error is itself a cancellation", async assert => {
    assert.expect(1);

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
    } catch (e) {
      assert.ok(isCancellation(e), "error is a cancellation");
    }
  });
});
