import { render } from '@testing-library/react';

import Task from './Task';

describe('Task', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Task />);
    expect(baseElement).toBeTruthy();
  });
});
