import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './common.css';
import { App } from './components/App/App';
import { initI18n } from '@features/locale/utils';
import { NetworkStatusContextProvider } from '@features/networkStatus/NetworkStatusContextProvider';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function () {
        console.log('Service Worker Registered!!');
      })
      .catch((e) => console.error('cant register SW', e));
  });
}

initI18n(() => {
  ReactDOM.render(
    <NetworkStatusContextProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <App />
      </Router>
    </NetworkStatusContextProvider>,
    document.getElementById('root')
  );
});
