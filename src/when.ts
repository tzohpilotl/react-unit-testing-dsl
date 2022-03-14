import userEvent from "@testing-library/user-event";
import { ConfigurationError } from "./error";
import type { TestState, ComponentDriverActions } from "./index";

export function when(state: TestState) {
  return function whenStateClosure(
    description: string,
    getAlgorithm: (actions: ComponentDriverActions) => any[]
  ) {
    if (state.when.called) {
      throw ConfigurationError("when");
    }
    state.when = { description, getAlgorithm, called: true };
  };
}

export async function whenExecute(state: TestState) {
  const steps = state.when.getAlgorithm(userEvent);
  await Promise.all(
    steps.map(async ([find, execute]) => {
      const node = await find(state.result);
      await execute(node);
    })
  );
}
