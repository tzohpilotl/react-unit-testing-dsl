import React from "react";
import { render } from "@testing-library/react";
import { ConfigurationError } from "./error";
import type { TestState } from "./index";

export function given(state: TestState) {
  return function givenStateClosure(description: string, props: any) {
    if (state.given.called) {
      throw ConfigurationError("given");
    }
    state.given = { props, description, called: true };
  };
}

export async function givenExecute(Component: any, state: TestState) {
  const props = state.given.props();
  state.result = await render(<Component {...props} />);
}
