import { ConfigurationError } from "./error";
import type { TestState, ComponentAssertions } from "./index";

export function then(state: TestState) {
  return function thenStateClosure(
    description: string,
    getExpectations: (assertions: ComponentAssertions) => any[]
  ) {
    if (state.then.called) {
      throw ConfigurationError("then");
    }
    state.then = { description, getExpectations, called: true };
  };
}

export async function thenExecute(state: TestState) {
  const expectations = state.then.getExpectations(state.result);
  const results = await Promise.all(
    expectations.map((expect) => expect(state.result))
  );
}
