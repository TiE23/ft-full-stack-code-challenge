import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import toast, { Toaster } from 'react-hot-toast';

import { AppContainer } from './App.styles';
import { Board } from './components/Board';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      toast.error(`An error occurred.${err ? `\n${String(err)}` : ''}`);
    },
  }),
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContainer>
        <Board />
      </AppContainer>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
