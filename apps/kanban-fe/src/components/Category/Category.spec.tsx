import { render } from '@testing-library/react';

import Category from './Category';

describe('Category', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Category />);
    expect(baseElement).toBeTruthy();
  });
});
