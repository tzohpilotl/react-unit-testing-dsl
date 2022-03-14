import React, { useState } from "react";
import { render } from "@testing-library/react";
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
    const renderResult = render(<Clickable />);
    const querySpy = jest.fn();
    const actionSpy = jest.fn();
    const actions = [
      [
        async () => {
          querySpy();
          return await renderResult.findByText("closed");
        },
        actionSpy,
      ] as const,
      [
        async () => {
          querySpy();
          return await renderResult.findByText("closed");
        },
        actionSpy,
      ] as const,
    ];
    await expect(
      whenExecute(renderResult, () => actions)
    ).resolves.not.toThrow();
    expect(querySpy).toHaveBeenCalledTimes(2);
    expect(actionSpy).toHaveBeenCalledTimes(2);
  });

  it("correctly applies actions to the component", async function () {
    const renderResult = render(<Clickable />);
    await expect(
      renderResult.findByText("closed", {}, { timeout: 10 })
    ).resolves.toBeDefined();
    await whenExecute(renderResult, ({ click }) => [
      [async ({ findByText }) => await findByText("click"), click],
    ]);
    await expect(
      renderResult.findByText("open", {}, { timeout: 10 })
    ).resolves.toBeDefined();
  });
});
