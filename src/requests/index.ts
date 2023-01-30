import { DeLabAddress } from '@delab-team/connect';
import { useSelector, useDispatch } from 'react-redux'
import { Action, AnyAction, Dispatch } from 'redux';
import { write, IUser, IOracle } from '../store/userStore'

export const login = (address: DeLabAddress, dispatch: Dispatch) => fetch('http://localhost:5000/api/v1/login/', {
  body: JSON.stringify({ ownerAddress: address }),
  method: 'POST',
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
}).then(e => e.json()).then((e: IUser) => {
  console.log(e)
  dispatch(write(e))
})

export const createOracle = (user: IUser, dispatch: Dispatch) => {
  fetch('http://localhost:5000/api/v1/createOracle/', {
    method: 'POST',
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${user.apiKey}`
    },
  }).then(e => e.json()).then((e: { status: string, newOracle: IOracle }) => {
    console.log(e)
    if (e.status === 'ok') {
      dispatch(write({ ...user, oracles: [...user.oracles, e.newOracle] }))
    } else {
      alert('some error or denied')
      console.log(e)
    }
  })
  console.log('new')
}
