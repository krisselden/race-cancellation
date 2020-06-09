/** @type {import("assert")} */
const assert = require("assert");

const { sleep } = require("./helper");

describe("sleep", () => {
  it("raceCancellation is optional", async () => {
    const actual = await sleep(10, undefined, (cb) => {
      // noop newTimeout
      cb();
      return () => void 0;
    });
    assert.strictEqual(actual, undefined);
  });
});
