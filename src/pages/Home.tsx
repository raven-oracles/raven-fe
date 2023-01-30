import { DeLabModal, DeLabButton, DeLabConnect } from '@delab-team/connect'
import { useSelector, useDispatch } from 'react-redux'
import { write, IUser, IOracle } from '../store/userStore'
import store from '../store'
import { useEffect, FC, useState } from 'react'
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { createOracle } from '../requests/'
const DeLabConnector = new DeLabConnect('https://google.com', 'Test', 'mainnet')

export const Home: FC = () => {
    const user = useSelector((state: ReturnType<typeof store.getState>) => state.user.value)
    const wallet = useSelector((state: ReturnType<typeof store.getState>) => state.wallet.value)
    const { isConnected, address, network, typeConnect } = wallet
    const dispatch = useDispatch()
    return (
        <div style={{
            background: 'black',
            color: '#fff',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `cover`
        }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '650px',
                    backgroundColor: isConnected ? '#00000059' : 'transparent',
                    borderRadius: '20px',
                    padding: '20px',
                    marginTop: '20px',
                }}>
                    {isConnected ? <div>
                        <h1>RAVEN</h1>
                        <h3>Your owner wallet info block</h3>
                        <p>isConnected: {isConnected ? 'Connected' : 'Disconnected'}</p>
                        <p>typeConnect: {typeConnect}</p>
                        <p>network: {network}</p>
                        <p>address: {address ? `${address.substr(0, 5)}...${address.substr(address.length - 5, address.length)}` : ``}</p>
                        {user ? <>
                            <h3>Your oracles info block</h3>
                            <p>
                                Your raven apiKey: {`${user.apiKey.slice(0, 5)}...${user.apiKey.slice(-5)}`}
                            </p>
                            <p>
                                Your existed oracles: {
                                    !user.oracles[0] ? <p> * You dont have any</p> :
                                        user.oracles.map((e: IOracle) => <p><Link to={`/oracle/${e.oracleKey}`}><button onClick={() => console.log(e)}>id {`${e.oracleKey.slice(0, 5)}...${e.oracleKey.slice(-5)}`}</button>
                                        </Link></p>
                                        )
                                }
                            </p>
                            <p>
                                <button onClick={() => createOracle(user, dispatch)}>Create new raven oracle</button>
                            </p></> : 'some error with acc login'}
                    </div> : null}
                </div>
            </div>
        </div >
    )
}
