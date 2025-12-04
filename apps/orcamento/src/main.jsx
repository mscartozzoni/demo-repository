import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { CartProvider } from '@/hooks/useCart';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </>
);