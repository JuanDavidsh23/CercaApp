import { describe, it, expect } from 'vitest';
import { assertNever } from '../utils';

describe('Utils: assertNever', () => {
  it('throws an error with the unhandled value', () => {
    const unhandledValue = { some: 'value' } as never;
    expect(() => assertNever(unhandledValue)).toThrowError(/Unhandled discriminated union member/);
  });
});
