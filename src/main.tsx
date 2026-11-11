import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import { App } from './App';
import './styles.css';
import './launch-theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /><Analytics /></React.StrictMode>);
