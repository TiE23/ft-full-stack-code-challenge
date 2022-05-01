import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Board from './Board';

describe('Board', () => {
  let queryClient: QueryClient;

  jest.mock('react-query', () => ({
    useQuery: () => ({ isLoading: false, error: {}, data: [] }),
  }));

  beforeAll(() => {
    queryClient = new QueryClient();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <Board />
      </QueryClientProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
