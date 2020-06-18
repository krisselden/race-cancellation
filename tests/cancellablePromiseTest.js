/** @type {import("assert")} */
const assert = require("assert");

const { cancellablePromise } = require("./helper");

describe("cancellablePromise", () => {
  it("works without passing a raceCancellation arg", async () => {
    const expected = new Date();
    const actual = await /** @type {Promise<unknown>} */ (cancellablePromise(
      (resolve) => {
        resolve(expected);
        return () => void 0;
      }
    ));
    assert.equal(actual, expected);
  });
});
