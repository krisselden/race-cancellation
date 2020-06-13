/** @type {import("assert")} */
const assert = require("assert");

const { defaultRaceCancel } = require("./helper");

describe("defaultRaceCancel", () => {
  it("it just invokes the task", async () => {
    const expected = new Date();
    const actual = await defaultRaceCancel(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("it just resolves the promise", async () => {
    const expected = new Date();
    const actual = await defaultRaceCancel(Promise.resolve(expected));
    assert.equal(actual, expected);
  });
});
