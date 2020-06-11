/** @type {import("assert")} */
const assert = require("assert");

const { noopRaceCancel } = require("./helper");

describe("noopRaceCancel", () => {
  it("it just invokes the task", async () => {
    const expected = new Date();
    const actual = await noopRaceCancel(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("it just resolves the promise", async () => {
    const expected = new Date();
    const actual = await noopRaceCancel(Promise.resolve(expected));
    assert.equal(actual, expected);
  });
});
