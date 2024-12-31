import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importation des styles Tailwind CSS
import App from './App'; // Composant principal

// Création de la racine et rendu de l'application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
