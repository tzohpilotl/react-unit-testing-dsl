import userEvent from "@testing-library/user-event";
import { ConfigurationError } from "./error";
import type { RenderResult } from "@testing-library/react";
import type { TestState, StrategyFn } from "./index";

export function when(state: TestState) {
  return function whenStateClosure(
    description: string,
    getAlgorithm: StrategyFn
  ) {
    if (state.when.called) {
      throw ConfigurationError("when");
    }
    state.when = { description, getAlgorithm, called: true };
  };
}

export async function whenExecute(
  result: RenderResult,
  getAlgorithm: StrategyFn
) {
  // This for loop is necessary because there would be an act() warning if we triggered
  // all the DOM promises at once
  for (const [find, execute] of getAlgorithm(userEvent)) {
    const node = await find(result);
    await execute(node);
  }
}
