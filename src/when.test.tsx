import React, { useState } from "react";
import { render } from "@testing-library/react";
import { ComponentDriverActions, getInitialState } from "./index";
import { whenExecute } from "./when";

const Clickable = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open ? "open" : "closed"}
      <button onClick={() => setOpen(!open)}>click</button>
    </>
  );
};

describe("when", function () {
  it("executes all actions", async function () {
    const actions = [
      [jest.fn(), jest.fn()],
      [jest.fn(), jest.fn()],
    ];
    const getAlgorithm: (actions: ComponentDriverActions) => any[] | [] = () =>
      actions;
    await whenExecute(render(<Clickable />), getAlgorithm);
    expect.assertions(actions.length * 2);
    actions.forEach(([find, execute]) => {
      expect(find).toHaveBeenCalledTimes(1);
      expect(execute).toHaveBeenCalledTimes(1);
    });
  });

  it("correctly applies actions to the component", async function () {
    const renderResult = render(<Clickable />);
    const getAlgorithm: (actions: ComponentDriverActions) => any[] | [] = ({
      click,
    }) => [[async ({ findByText }: any) => await findByText("click"), click]];
    let node = await renderResult.findByText("closed", {}, { timeout: 10 });
    expect(node).toBeDefined();
    await whenExecute(renderResult, getAlgorithm);
    node = await renderResult.findByText("open", {}, { timeout: 10 });
    expect(node).toBeDefined();
  });
});
