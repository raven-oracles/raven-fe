import { createSlice } from '@reduxjs/toolkit'


export interface IOracle {
  oracleAddress: string;
  masterAddress: string;
  clientAddress: string;
  userAddress: string;
  oracleKey: string;
}

export interface IUser {
  ownerWallet: string;
  apiKey: string;
  oracles: Array<IOracle | null>
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: { ownerWallet: '', apiKey: '', oracles: [] },
  },
  reducers: {
    write: (state: { value: IUser }, action: { payload: IUser }) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { write } = userSlice.actions

export default userSlice.reducer
