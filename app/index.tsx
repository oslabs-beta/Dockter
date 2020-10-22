import React from 'react';
import { render } from 'react-dom';
import App from './containers/App.tsx';
import './app.global.css';

const root = document.getElementById('root');

document.addEventListener('DOMContentLoaded', () => {
  render(<App />, root);
});
