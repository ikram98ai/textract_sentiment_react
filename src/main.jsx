import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ChakraProvider value={defaultSystem}>
      <StrictMode>
            <App />
      </StrictMode>,
    </ChakraProvider>
)
