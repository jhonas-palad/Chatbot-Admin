import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'react-bootstrap';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"
    >
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/*" element={<App/>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </ThemeProvider>
);

