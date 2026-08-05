/**
 * Ensures that all cases in a discriminated union or switch statement are handled.
 * If the value reaches this function, it means it's not of type `never`,
 * which causes a TypeScript error.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}
