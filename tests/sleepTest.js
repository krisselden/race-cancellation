/** @type {import("assert")} */
const assert = require("assert");

const { sleep } = require("./helper");

describe("sleep", () => {
  it("raceCancellation is optional", async () => {
    const actual = await sleep(10, undefined);
    assert.strictEqual(actual, undefined);
  });
});
