import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthProvider.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { ModalLoginProvider } from './contexts/ModalLoginContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ModalLoginProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ModalLoginProvider>
    </AuthProvider>
  </StrictMode>,
)
