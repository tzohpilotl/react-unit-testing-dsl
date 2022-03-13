import React from "react";
import myDescribe from "./index";
import { ConfigurationError, SuiteStep } from "./error";

function DummyComponent() {
  return <p>Testing component</p>;
}

async function testSuiteOrder(order: SuiteStep[]) {
  let previous: null | SuiteStep = null;
  await myDescribe(DummyComponent, ({ given, when, then }) => {
    order.forEach((step) => {
      if (step === "given") {
        given("empty props", () => {
          expect(previous).toBe(null);
          previous = "given";
          return {};
        });
      }
      if (step === "when") {
        when("just renders", () => {
          expect(previous).toBe("given");
          previous = "when";
          return [];
        });
      }
      if (step === "then") {
        then("order is fine", () => {
          expect(previous).toBe("when");
          return [];
        });
      }
    });
  });
}

describe("describe", function () {
  it("calls it's spec function once", async function () {
    const specFunction = jest.fn();
    await myDescribe(DummyComponent, specFunction);
    expect(specFunction).toHaveBeenCalledTimes(1);
  });

  it("always calls it's suite in this order: given, when, then", async function () {
    await testSuiteOrder(["given", "when", "then"]);
    await testSuiteOrder(["then", "when", "given"]);
    await testSuiteOrder(["when", "then", "given"]);
  });

  it("errors when a suite step is configured more than once", async function () {
    const excerpt = /more than once/;
    await expect(
      testSuiteOrder(["given", "when", "then"])
    ).resolves.not.toThrow(excerpt);
    await expect(testSuiteOrder(["given", "given"])).rejects.toThrow(excerpt);
    await expect(testSuiteOrder(["given", "given"])).rejects.toThrowError(
      excerpt
    );
    await expect(testSuiteOrder(["when", "when"])).rejects.toThrowError(
      excerpt
    );
    await expect(
      testSuiteOrder(["given", "when", "then", "then"])
    ).rejects.toThrowError(excerpt);
    await expect(
      testSuiteOrder(["given", "when", "then", "given"])
    ).rejects.toThrowError(excerpt);
  });

  it("executes correctly when the unit lives up to the expectations", async function () {
    await myDescribe(DummyComponent, function ({ given, when, then }) {
      given("empty props", () => ({}));
      when("just renders", () => []);
      then("displays a text", ({ findByText }) => [
        async () => await findByText("Testing component"),
      ]);
    });
  });
});
