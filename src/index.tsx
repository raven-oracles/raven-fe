import React from 'react'
import eruda from 'eruda'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { App } from './App'
import { Oracle } from './Oracle'

import { BrowserRouter, Route, Routes } from "react-router-dom";

const el = document.createElement('div')
document.body.appendChild(el)

eruda.init({
    container: el,
    tool: ['console', 'elements']
})

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/oracle/:id" element={<Oracle />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.querySelector('#root')
)
