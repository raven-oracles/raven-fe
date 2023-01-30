
import { DeLabModal, DeLabButton, DeLabConnect } from '@delab-team/connect'
import { useSelector, useDispatch } from 'react-redux'
import { write, IWallet } from '../store/walletStore'
import store from '../store/'
import {
  DeLabNetwork,
  DeLabTypeConnect,
  DeLabAddress,
  DeLabConnecting,
  DeLabTransaction,
  DeLabEvent
} from '@delab-team/connect'
import { useEffect, FC, useState } from 'react'
import { login } from '../requests/'
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
const DeLabConnector = new DeLabConnect('https://google.com', 'Test', 'mainnet')

export const WalletConnect: FC = () => {
  const wallet = useSelector((state: ReturnType<typeof store.getState>) => state.wallet.value)
  const dispatch = useDispatch()

  const { isConnected, address, network, typeConnect } = wallet
  const [firstRender, setFirstRender] = useState<boolean>(false)

  function listenDeLab() {
    DeLabConnector.on('connect', (data: DeLabEvent) => {
      const connectConfig: DeLabConnecting = data.data
      login(connectConfig.address, dispatch)
      dispatch(write({
        isConnected: true,
        address: connectConfig.address,
        network: connectConfig.network,
        typeConnect: connectConfig.typeConnect
      }))
    })

    DeLabConnector.on('disconnect', () => {
      dispatch(write({
        isConnected: false,
        address: undefined,
        network: 'mainnet',
        typeConnect: undefined
      }))
      console.log('disconect')
    })

    DeLabConnector.loadWallet()
  }

  useEffect(() => {
    if (!firstRender && DeLabConnector) {
      setFirstRender(true)
      listenDeLab()
    }
  }, [])

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
          {!isConnected ?
            <DeLabButton DeLabConnectObject={DeLabConnector} scheme={'dark'} />
            :
            <button onClick={() => { DeLabConnector.disconnect() }}>disconect</button>
          }
        </div>
      </div>
      <DeLabModal DeLabConnectObject={DeLabConnector} scheme={'dark'} />
    </div >
  )
}
