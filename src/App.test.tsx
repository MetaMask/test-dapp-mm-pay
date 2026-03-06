import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders without crashing', () => {
    expect(() => render(<div />)).not.toThrow();
  });
});
