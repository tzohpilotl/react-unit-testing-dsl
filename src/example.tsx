import describe from "./index";

describe(Greeting, ({ given, when, then }) => {
  given("valid props", () => ({ name: "Mario" }));
  when("the user clicks the component twice", ({ click }) => [
    click,
    click,
  ]);
  then("displays a greeting", ({ exists }) => [exists]);
});

function Greeting(props: { name: string }) {
  return <p>{`Hello ${props.name}!`}</p>;
}
