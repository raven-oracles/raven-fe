import React from 'react'
import eruda from 'eruda'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/'
import { App } from './App'
import './style.css'

const el = document.createElement('div')
document.body.appendChild(el)


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.querySelector('#root')
)
