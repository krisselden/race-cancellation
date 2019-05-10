const { oneshot } = require("race-cancellation");

QUnit.module("oneshot", () => {
  QUnit.test(
    "calling complete more than once doesn't affect result",
    async assert => {
      const expected = new Date();
      const [promise, complete] = oneshot();
      complete(expected);
      complete("something else");
      const actual = await promise();
      assert.equal(actual, expected);
    }
  );
});
