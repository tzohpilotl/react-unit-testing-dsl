import React from "react";
import { render } from "@testing-library/react";
import { ConfigurationError } from "./error";
import type { PropsFn, TestState } from "./index";

export function given(state: TestState) {
  return function givenStateClosure(description: string, props: PropsFn) {
    if (state.given.called) {
      throw ConfigurationError("given");
    }
    state.given = { props, description, called: true };
  };
}

export async function givenExecute(Component: any, props: PropsFn) {
  return render(<Component {...props()} />);
}
