import { RenderResult } from "@testing-library/react";
import { ConfigurationError } from "./error";
import type { TestState, ExpectationsFn } from "./index";

export function then(state: TestState) {
  return function thenStateClosure(
    description: string,
    getExpectations: ExpectationsFn
  ) {
    if (state.then.called) {
      throw ConfigurationError("then");
    }
    state.then = { description, getExpectations, called: true };
  };
}

export async function thenExecute(
  result: RenderResult,
  getExpectations: ExpectationsFn
) {
  const expectations = getExpectations(result);
  return await Promise.all(expectations.map((expect) => expect(result)));
}
