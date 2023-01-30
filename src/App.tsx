import React from 'react'
import { Home } from './pages/Home'
import { Oracle } from './pages/Oracle'
import { WalletConnect } from './components/WalletConnect'
import './style.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const App: React.FC = () => {

    return (
        <BrowserRouter>
            <WalletConnect />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/oracle/:id" element={<Oracle />} />
            </Routes>
        </BrowserRouter>
    )
}
