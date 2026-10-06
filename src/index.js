import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Scroll-in animations only when the browser supports them and the visitor has
// not asked for reduced motion. Set before the first render to avoid a flash.
if (
  'IntersectionObserver' in window &&
  !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
) {
  document.documentElement.classList.add('motion-ok');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
