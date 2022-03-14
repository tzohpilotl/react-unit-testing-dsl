import userEvent from "@testing-library/user-event";
import { given, givenExecute } from "./given";
import { when, whenExecute } from "./when";
import { then, thenExecute } from "./then";
import type { PropsWithChildren } from "react";
import type { RenderResult } from "@testing-library/react";

export type ComponentAssertions = any;

export type ComponentDriverActions = typeof userEvent;

export type Expectation =
  | ((r: RenderResult) => Promise<void>)
  | ((r: RenderResult) => void);

export type ExpectationsFn = (assertions: ComponentAssertions) => Expectation[];

export type Query =
  | ((r: RenderResult) => HTMLElement)
  | ((r: RenderResult) => Promise<HTMLElement>);

export type Action =
  | ((e: HTMLElement) => Promise<void>)
  | ((e: HTMLElement) => void);

export type StrategyStep = readonly [Query, Action];

export type StrategyFn = (
  actions: ComponentDriverActions
) => StrategyStep[] | [];

export type PropsFn = () => PropsWithChildren<any>;

interface TestSuite {
  given: (description: string, props: PropsFn) => void;
  when: (description: string, getAlgorithm: StrategyFn) => void;
  then: (description: string, getExpectations: ExpectationsFn) => void;
}

export interface TestState {
  given: {
    called: boolean;
    description: string;
    props: PropsFn;
  };
  when: {
    called: boolean;
    description: string;
    getAlgorithm: StrategyFn;
  };
  then: {
    called: boolean;
    description: string;
    getExpectations: ExpectationsFn;
  };
}

export const getInitialState = () =>
  ({
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
  const result = await givenExecute(Component, state.given.props);
  await whenExecute(result, state.when.getAlgorithm);
  await thenExecute(result, state.then.getExpectations);
}

export default describe;
