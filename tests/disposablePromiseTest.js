const assert = require("assert");

const { disposablePromise } = require("..");

describe("disposablePromise", () => {
  it("works without passing a raceCancellation arg", async () => {
    const expected = new Date();
    const actual = await disposablePromise(resolve => {
      resolve(expected);
      return () => void 0;
    });
    assert.equal(actual, expected);
  });
});
