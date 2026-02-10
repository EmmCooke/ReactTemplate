import { test, expect } from "../fixtures";

test("home page displays welcome heading", async ({ homePage }) => {
  await expect(homePage.heading).toHaveText("Welcome");
});
