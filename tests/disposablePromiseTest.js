const { disposablePromise } = require("race-cancellation");

QUnit.module("disposablePromise", () => {
  QUnit.test("works without passing a raceCancellation arg", async assert => {
    const expected = new Date();
    const actual = await disposablePromise(resolve => {
      resolve(expected);
      return () => void 0;
    });
    assert.equal(actual, expected);
  });
});
