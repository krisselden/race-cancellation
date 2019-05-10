const { noopRaceCancellation } = require("race-cancellation");

QUnit.module("noopRaceCancellation", () => {
  QUnit.test("it just invokes the task", async assert => {
    const expected = new Date();
    const actual = await noopRaceCancellation(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });
});
