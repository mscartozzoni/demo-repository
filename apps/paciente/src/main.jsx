
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { ApiProvider } from '@/contexts/ApiContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ApiProvider>
            <App />
          </ApiProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);
