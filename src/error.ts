export type SuiteStep = "given" | "when" | "then";

export function ConfigurationError(step: SuiteStep) {
  const error = new Error(`The "${step}" step was configured more than once`);
  return error;
}
