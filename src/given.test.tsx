import React from 'react';
import { givenExecute } from "./given";

const DummyComponent = () => <p>Hello</p>;

describe("given", function () {
  it("renders the component", function () {
    const node = givenExecute(DummyComponent, () => ({}));
    expect(node).toBeDefined();
  });
});
