/** @type {import("assert")} */
const assert = require("assert");

const { disposablePromise } = require("./helper");

describe("disposablePromise", () => {
  it("works without passing a raceCancellation arg", async () => {
    const expected = new Date();
    const actual = await /** @type {Promise<unknown>} */ (disposablePromise(
      (resolve) => {
        resolve(expected);
        return () => void 0;
      }
    ));
    assert.equal(actual, expected);
  });
});
