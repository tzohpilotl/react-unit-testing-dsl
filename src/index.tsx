import userEvent from "@testing-library/user-event";
import { given, givenExecute } from "./given";
import { when, whenExecute } from "./when";
import { then, thenExecute } from "./then";

export type ComponentAssertions = any;

export type ComponentDriverActions = typeof userEvent;

interface TestSuite {
  given: (description: string, props: any) => void;
  when: (
    description: string,
    getAlgorithm: (actions: ComponentDriverActions) => any[]
  ) => void;
  then: (
    description: string,
    getExpectations: (assertions: ComponentAssertions) => any[]
  ) => void;
}

export interface TestState {
  result: any;
  value: any;
  given: {
    called: boolean;
    description: string;
    props: () => any;
  };
  when: {
    called: boolean;
    description: string;
    getAlgorithm: (actions: ComponentDriverActions) => any[] | [];
  };
  then: {
    called: boolean;
    description: string;
    getExpectations: (assertions: ComponentAssertions) => any[];
  };
}

export const getInitialState = () => ({
  result: null,
  value: null,
  given: { called: false, description: "", props: () => ({}) },
  then: { called: false, description: "", getExpectations: () => [] },
  when: { called: false, description: "", getAlgorithm: () => [] },
} as TestState);

async function describe(Component: any, spec: (t: TestSuite) => void) {
  const state: TestState = getInitialState();
  spec({
    given: given(state),
    when: when(state),
    then: then(state),
  });
  await givenExecute(Component, state);
  await whenExecute(state);
  await thenExecute(state);
}

export default describe;
