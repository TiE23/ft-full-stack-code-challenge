import { QueryClient, QueryClientProvider } from 'react-query';
import { Board } from './components/Board';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Board />
      </div>
    </QueryClientProvider>
  );
};

export default App;
