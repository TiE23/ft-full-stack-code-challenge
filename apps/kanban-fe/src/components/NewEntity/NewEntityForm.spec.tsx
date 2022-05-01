import { render } from '@testing-library/react';

import NewEntityForm from './NewEntityForm';

describe('NewEntityForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NewEntityForm />);
    expect(baseElement).toBeTruthy();
  });
});
