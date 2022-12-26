import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  return library;
}

root.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </StrictMode>
);
