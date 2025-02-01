import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TimeAgo from 'javascript-time-ago';
import App from './App.jsx';
import './index.css';

// Importar el paquete de localización
import es from 'javascript-time-ago/locale/es.json';

// Registrar el idioma
TimeAgo.addDefaultLocale(es);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)