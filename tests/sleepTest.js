const assert = require("assert");

const { sleep } = require("..");

describe("sleep", () => {
  it("raceCancellation is optional", async () => {
    const res = await sleep(10, undefined, cb => {
      // noop newTimeout
      cb();
      return () => void 0;
    });
    assert.strictEqual(res, undefined);
  });
});
