import { createSlice } from '@reduxjs/toolkit'
import { DeLabAddress, DeLabNetwork, DeLabTypeConnect } from '@delab-team/connect'

export interface IWallet {
  isConnected: boolean;
  address: DeLabAddress;
  network: DeLabNetwork;
  typeConnect: DeLabTypeConnect;
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    value: { isConnected: false, address: undefined as DeLabAddress, network: 'mainnet' as DeLabNetwork, typeConnect: undefined },
  },
  reducers: {
    write: (state: { value: IWallet }, action: { payload: IWallet }) => {
      state.value = action.payload
    },
  },
})

export const { write } = walletSlice.actions
export default walletSlice.reducer
