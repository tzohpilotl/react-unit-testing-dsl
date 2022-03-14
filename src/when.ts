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
  const steps = getAlgorithm(userEvent);
  await Promise.all(
    steps.map(async ([find, execute]) => {
      const node = await find(result);
      await execute(node);
    })
  );
}
