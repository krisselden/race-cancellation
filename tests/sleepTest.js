const { sleep } = require("race-cancellation");

QUnit.module("sleep", () => {
  QUnit.test("raceCancellation is optional", async assert => {
    const res = await sleep(10, undefined, cb => {
      // noop newTimeout
      cb();
      return () => void 0;
    });
    assert.strictEqual(res, undefined);
  });
});
