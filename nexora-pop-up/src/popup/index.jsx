import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Popup from './Popup';
import './index.css';
import './Popup.css';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);