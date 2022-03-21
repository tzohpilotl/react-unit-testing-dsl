import React from "react";
import { render } from "@testing-library/react";
import { thenExecute } from "./then";

function TestComponent() {
  return <p>Hello</p>;
}

describe("then", function () {
  it("calls all expectations", async function () {
    const expectations = [jest.fn(), jest.fn(), jest.fn()];
    const result = render(<TestComponent />);
    await thenExecute(result, () => expectations);
    expect.assertions(6);
    expectations.forEach(function (expectation) {
      expect(expectation).toHaveBeenCalledTimes(1);
      expect(expectation).toHaveBeenCalledWith(result);
    });
  });
});
