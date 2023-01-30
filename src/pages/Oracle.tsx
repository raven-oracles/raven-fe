
import { DeLabModal, DeLabButton, DeLabConnect } from '@delab-team/connect'
import { useSelector, useDispatch } from 'react-redux'
import { write, IUser, IOracle } from '../store/userStore'
import store from '../store/'
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

import { BrowserRouter, Route, Link, useParams } from "react-router-dom";

const DeLabConnector = new DeLabConnect('https://google.com', 'Test', 'mainnet')


export const Oracle: FC = () => {
  const user = useSelector((state: ReturnType<typeof store.getState>) => state.user.value)
  const wallet = useSelector((state: ReturnType<typeof store.getState>) => state.wallet.value)
  const dispatch = useDispatch()

  const { isConnected, address, network, typeConnect } = wallet
  const { id } = useParams();

  const [oracle, setOracle] = useState<IOracle | null>(null)

  useEffect(() => {
    setOracle(user.oracles.filter((e: IOracle) => e.oracleKey === id)[0] as IOracle)
  }, [user])

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
          height: '80vh'
        }}>

          <Link to='/'>go back</Link>
          {isConnected ? <div>
            <h1>Oracle {id}</h1>
            {(user && oracle) ? <>
              <h3>Your oracle info block</h3>
              <p>
                Your raven apiKey: {`${user.apiKey.slice(0, 5)}...${user.apiKey.slice(-5)}`}
              </p>
              <p>oracleAddress: {oracle.oracleAddress}</p>
              <p>masterAddress: {oracle.masterAddress}</p>
              <p>clientAddress: {oracle.clientAddress}</p>
              <p>userAddress: {oracle.userAddress}</p>
            </> : 'some error with acc login'}
          </div>
            : null}
        </div >
      </div >
    </div >
  )
}
