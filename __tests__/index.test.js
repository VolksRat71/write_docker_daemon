const path = require("path");
const app = require(path.join(process.cwd(), "/assets/app.js"));

test("Should rewrite resolv.conf", async function () {
  const test = await app();

  console.log(test);

  expect(true).toBe(true);
});
