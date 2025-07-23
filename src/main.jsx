import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './scss/basic/_normalize.scss';
import './scss/template/template.scss';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
