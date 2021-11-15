import {StrictMode} from 'react';
import * as ReactDOM from 'react-dom';
import {QueryClient, QueryClientProvider} from 'react-query'
import {ChakraProvider} from '@chakra-ui/react'
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <App/>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById('root')
);
