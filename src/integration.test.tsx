import React, { useState } from "react";
import myDescribe from "./index";

const Clickable = ({ name }: { name: string }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <>
      <p>{loggedIn ? `Hello ${name}!` : "Hello stranger"}</p>
      <button onClick={() => setLoggedIn(!loggedIn)}>click</button>
      </>
  );
};

async function testAComponent() {
  return await myDescribe(Clickable, function ({ given, when, then }) {
    given("valid props", () => ({ name: "Mario" }));
    when("the user clicks it once", ({ click }) => [
      // The "when" function receives the functions from @testing-library/user-event
      [
        async ({ findByText }) => await findByText(/stranger/),
        () => {
          // No behavior here since we just want to make sure the component says "closed" at the beginning
        },
      ],
      // These behavior specs receive the render result with all its queries
      [async ({ findByText }) => await findByText("click"), click],
      // Since this step is all about precondition we could check some elements exist before the main assertionss
    ]);
    then("displays a text", ({ findByText }) => [
      // The "then" function receives the render result with all its quries
      async () => await findByText(/Mario/, {}, { timeout: 10 }),
    ]);
  });
}

describe("integration", function () {
  it("executes without errors", async function () {
    await expect(testAComponent()).resolves.not.toThrow();
  });
});
