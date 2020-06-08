const assert = require("assert");

const { noopRaceCancellation } = require("..");

describe("noopRaceCancellation", () => {
  it("it just invokes the task", async () => {
    const expected = new Date();
    const actual = await noopRaceCancellation(() => Promise.resolve(expected));
    assert.equal(actual, expected);
  });

  it("it just resolves the promise", async () => {
    const expected = new Date();
    const actual = await noopRaceCancellation(Promise.resolve(expected));
    assert.equal(actual, expected);
  });
});
