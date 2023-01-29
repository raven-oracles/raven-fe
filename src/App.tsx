import { DeLabModal, DeLabButton, DeLabConnect } from '@delab-team/connect'
import { useSelector, useDispatch } from 'react-redux'
import { write, IUser, IOracle } from './userStore'
import store from './store'
import {
    DeLabNetwork,
    DeLabTypeConnect,
    DeLabAddress,
    DeLabConnecting,
    DeLabTransaction,
    DeLabEvent
} from '@delab-team/connect'
import { QRCodeSVG } from 'qrcode.react'
import { addListener } from 'process'
import { useEffect, FC, useState } from 'react'

import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
const DeLabConnector = new DeLabConnect('https://google.com', 'Test', 'mainnet')

export const App: FC = () => {
    const count = useSelector((state: ReturnType<typeof store.getState>) => state.user.value)
    const dispatch = useDispatch()

    const [firstRender, setFirstRender] = useState<boolean>(false)

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [address, setAddress] = useState<DeLabAddress>(undefined)
    const [network, setNetwork] = useState<DeLabNetwork>('mainnet')
    const [typeConnect, setTypeConnect] = useState<DeLabTypeConnect>(undefined)

    const [dataTx, setDataTx] = useState<any>(null)

    const [approveLink, setApproveLink] = useState<string>('')

    async function sendTransaction() {
        const trans: DeLabTransaction = {
            to: 'EQAgfrO5OwCDzm30rcxC0o49BBhaPPdPQAW8BgEbewPLJhgk',
            value: '100000000',
            text: 'Test pay'
        }
        const dataTx2 = await DeLabConnector.sendTransaction(trans)
        setDataTx(dataTx2)
    }

    function listenDeLab() {
        DeLabConnector.on('connect', (data: DeLabEvent) => {
            setIsConnected(true)
            const connectConfig: DeLabConnecting = data.data
            fetch('http://localhost:5000/api/v1/login/', {
                body: JSON.stringify({ ownerAddress: connectConfig.address }),
                method: 'POST',
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            }).then(e => e.json()).then((e: IUser) => {
                console.log(e)
                dispatch(write(e))
            })
            setAddress(connectConfig.address)
            setTypeConnect(connectConfig.typeConnect)
            setNetwork(connectConfig.network)
        })

        DeLabConnector.on('disconnect', () => {
            setIsConnected(false)
            setAddress(undefined)
            setTypeConnect(undefined)
            setNetwork('mainnet')
            console.log('disconect')
        })

        DeLabConnector.on('error', (data: DeLabEvent) => {
            console.log('error-> ', data.data)
        })

        DeLabConnector.on('error-transaction', (data: DeLabEvent) => {
            console.log('error-transaction-> ', data.data)
        })

        DeLabConnector.on('error-toncoinwallet', (data: DeLabEvent) => {
            console.log('error-toncoinwallet-> ', data.data)
        })

        DeLabConnector.on('error-tonhub', (data: DeLabEvent) => {
            console.log('error-tonhub-> ', data.data)
        })

        DeLabConnector.on('error-tonkeeper', (data: DeLabEvent) => {
            console.log('error-tonkeeper-> ', data.data)
        })

        DeLabConnector.loadWallet()
    }

    useEffect(() => {
        if (!firstRender && DeLabConnector) {
            setFirstRender(true)
            listenDeLab()
        }
    }, [])

    const goTo = (e: IOracle) => {
        console.log(e)
    }

    const addNew = () => {
        fetch('http://localhost:5000/api/v1/createOracle/', {
            // body: JSON.stringify({ ownerAddress: connectConfig.address }),
            method: 'POST',
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${count.apiKey}`
            },
        }).then(e => e.json()).then((e: { status: string, newOracle: IOracle }) => {
            console.log(e)
            if (e.status === 'ok') {
                dispatch(write({ ...count, oracles: [...count.oracles, e.newOracle] }))
            } else {
                alert('some error or denied')
                console.log(e)
            }
        })
        console.log('new')
    }
    return (
        <div style={{
            height: '100vh',
            background: '#161726',
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
                    height: '80vh'
                }}>
                    {!isConnected ?
                        <DeLabButton DeLabConnectObject={DeLabConnector} scheme={'dark'} />
                        : null}

                    {isConnected ? <div>
                        <h1>RAVEN</h1>
                        {count ? <>
                            <h3>Your oracles info block</h3>
                            <p>
                                Your raven apiKey: {`${count.apiKey.slice(0, 5)}...${count.apiKey.slice(-5)}`}
                            </p>
                            <p>
                                Your existed oracles: {
                                    !count.oracles[0] ? <p> * You dont have any</p> :
                                        count.oracles.map((e: IOracle) => <p><Link to={`/oracle/${e.oracleKey}`}><button onClick={() => goTo(e)}>id {`${e.oracleKey.slice(0, 5)}...${e.oracleKey.slice(-5)}`}</button>
                                        </Link></p>
                                        )
                                }
                            </p>
                            <p>
                                <button onClick={addNew}>Create new raven oracle</button>
                            </p></> : 'some error with acc login'}
                        <h3>Your owner wallet info block</h3>
                        <p>isConnected: {isConnected ? 'Connected' : 'Disconnected'}</p>
                        <p>typeConnect: {typeConnect}</p>
                        <p>network: {network}</p>
                        <p>address: {address ? `${address.substr(0, 5)}...${address.substr(address.length - 5, address.length)}` : ``}</p>
                        <button onClick={() => DeLabConnector.disconnect()}>
                            Disconnect
                        </button>
                        <h3>Send transaction</h3>
                        <p>transaction: {JSON.stringify(dataTx)}</p>
                        {approveLink !== '' ?
                            <div style={{ borderRadius: '20px', padding: '20px', background: '#fff', marginBottom: '20px', width: '200px' }}>
                                <QRCodeSVG value={approveLink} width={200} height={200} />
                            </div>
                            : null}
                    </div> : null}
                </div>
            </div>
            <DeLabModal DeLabConnectObject={DeLabConnector} scheme={'dark'} />
        </div >
    )
}
                        // <button onClick={() => sendTransaction()}>
                        //     Send test transaction
                        // </button>
