/** @type {import("assert")} */
const assert = require("assert");

const { oneshot } = require("./helper");

describe("oneshot", () => {
  it("calling complete more than once doesn't affect result", async () => {
    const expected = new Date();
    const [promise, complete] = oneshot();
    complete(expected);
    complete("something else");
    const actual = await promise();
    assert.equal(actual, expected);
  });
});
