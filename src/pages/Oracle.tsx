
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
import { Base64 } from "@tonconnect/protocol";
import { QRCodeSVG } from 'qrcode.react'
import { addListener } from 'process'
import { useEffect, FC, useState } from 'react'
import { Sha256 } from '@aws-crypto/sha256-js';
import BN from 'bn.js'
import {
  Address,
  TonClient,
  contractAddress,
  beginCell,
  serializeDict,
  toNano,
  StateInit,
  beginDict,
  InternalMessage,
  fromNano,
  CommonMessageInfo,
} from 'ton';

const endpoint = 'https://testnet.toncenter.com/api/v2/jsonRPC'
const apiKey = '90b7661848dd60552f44bbcb30ad961127dcc21961707bf3b86ca0fb93933d0e'
import { BrowserRouter, Route, Link, useParams } from "react-router-dom";
import { Cell } from 'ton'
import { btoa } from 'buffer'
import { url } from 'inspector'
const oracleMasterSourceV1CodeBoc =
  'te6ccsECEAEAAmsAAA0AEgAXADIANwA8AFYAbgCMAJEAlgD5AWMB4gJjAmsBFP8A9KQT9LzyyAsBAgFiCQICASAEAwAxvbUfaiaH0gamp9AGoA6HoCgOmP6hgLL4NAIBIAgFAgEgBwYAL7dCnaiaH0gamp9AGoA6HoCgOmP6hg2MMAArt149qJofSBqan0AagDoegKA6Y/qGEAA3uhle1E0PpA1NT6ANQB0PQFAdMf1DBsYdDXCx+AICzA0KAgFIDAsAwVcJNTArmOVqT4KFMUAnACyFjPFssfySHIywET9AAS9ADLAMn5AHB0yMsCygfL/8nQcIIQ5eEb6cjLH8s/UjDMydBwgBjIywVQA88Wggr68ID6AhLLagHPFsmAQPsA6F8EgAz1MTU1+ChAYwJwAshYzxbLH8khyMsBE/QAEvQAywDJIPkAcHTIywLKB8v/ydCCEIZgqdwQNEZQcHCCEC8gZ8LIyx/LP1AEzxZY+gLLH8sfzMl3gBjIywVQBM8WWPoCEstrEszMyXH7AIAffZBjgEkvgnAA6GmB/SAYEH0iGIE42EkvgvB2omh9IGpqfQBqAOh6AoDpj+oYBOmP6Z/BCEwSmrwpGF1HG5ytnBwcKKNBg/oHN9CY+XAzgWoYKgmAqguylAFkegBk5CgD54sK5gnmAP0BCeZlj+Zk9qoseAXwHUEIJ1GPd8DgH8UiC6jjsxOwmCCTEtAKEH+kAwCaRUFUNUc2UsAsj0AMnIUAfPFhXME8wB+gITzMsfzMntVBAoECcQRkAzBQTwCeAWXwY0NIIQbS07RRO6ji0B+QEi+QG68uBn+gAwAoIID0JAoVIgu/LgZXCAGMjLBVjPFlj6AstqyYBA+wDgDwAMXwSED/Lwylce5A=='

export const oracleMasterSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleMasterSourceV1CodeBoc, 'base64'))[0];
const oracleClientSourceV1CodeBoc =
  'te6ccsECEgEAAi8AAA0AEgAXADQAOQBYAF0AewCdAKIApwC+AMMA8QEIAXgB+QIvART/APSkE/S88sgLAQIBYgkCAgEgBAMANbyVT2omhqagDofSB9IBgBfQBpj+mP6Y+YCCLAIBIAYFADm7oU7UTQ1NQB0PpA+kAwAvoA0x/TH9MfMBBFXwaAICdAgHADiqJ+1E0NTUAdD6QPpAMAL6ANMf0x/THzAQRWxhAECple1E0NTUAdD6QPpAMAL6ANMf0x/THzAQRV8G0NcLHwICzA8KAgEgDAsAKdOEAMZGWCqAHniwD9AWW1ZMAgfYBAIBWA4NAFcghCYJTV4yMsfE8s/zMnQcIAYyMsFUAPPFoIK+vCA+gISy2oBzxbJgED7AIAApHCAGMjLBVADzxYB+gLLasmAQPsAgAdnZkQ44BJL4HwaGmBgLjYSS+B8HwTt5EYAP0gGAFpj+mfwQgXkDPhKRhdRyAar4H2omh9IGmPmAF8gJD8gN15cDOBfSB9AGmP6Y/qGAMCAuQoA2eLKAJni2SC5GYK5gD9AQnlj4llj+WP5PaqcEEAH87UTQ1NQB0PpA+kAwAvoA0x/TH9MfMBBFghDl4RvpUqC6jjI2Nzc3OAb5ASf5Abry4GcB1DAGVTDIUAbPFlAEzxbJBcjMFcwB+gITyx8Syx/LH8ntVOBfA4IQguljQ1Jwuo4aNDU3BfkBJvkBuvLgZ1EzufLQZUA08AsB8ArgEQBoECNfAzIzghBtLTtFErqOHQL5ASL5Abry4Gf6ADACgggPQkChUiC78uBlAfAM4F8EhA/y8P+kLOQ='

export const oracleClientSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleClientSourceV1CodeBoc, 'base64'))[0]

export enum OPS {
  // Excesses = 0xd53276db,
  Signup = 0x4ea31eef,
  CreateAccount = 0x2f2067c2,
  Fetch = 0x82e96343,
  Update = 0x98253578,
  Withdrawal = 0x6d2d3b45,
  NewValue = 0xe5e11be9,
}
const ONCHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;

export type OracleMetaDataKeys = 'name' | 'description' | 'image';

const oracleOnChainMetadataSpec: {
  [key in OracleMetaDataKeys]: 'utf8' | 'ascii' | undefined;
} = {
  name: 'utf8',
  description: 'utf8',
  image: 'ascii',
};

const sha256 = (str: string) => {
  const sha = new Sha256();
  sha.update(str);
  return Buffer.from(sha.digestSync());
};
function buildAddressesDict(addresses: Address[]): Cell {
  const addressesMap = new Map(addresses.map((address, i) => [new BN(address.hash).toString(10), i]));
  const addressesDict = serializeDict(addressesMap, 256, (i: any, cell: any) => cell.bits.writeUint(i, 32));
  return addressesDict;
}
export function buildOracleMetadataCell(data: { [s: string]: string | undefined }): Cell {
  const KEYLEN = 256;
  const dict = beginDict(KEYLEN);

  Object.entries(data).forEach(([k, v]: [string, string | undefined]) => {
    if (!oracleOnChainMetadataSpec[k as OracleMetaDataKeys])
      throw new Error(`Unsupported onchain key: ${k}`);
    if (v === undefined || v === '') return;

    let bufferToStore = Buffer.from(v, oracleOnChainMetadataSpec[k as OracleMetaDataKeys]);

    const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);

    const rootCell = new Cell();
    rootCell.bits.writeUint8(SNAKE_PREFIX);
    let currentCell = rootCell;

    while (bufferToStore.length > 0) {
      currentCell.bits.writeBuffer(bufferToStore.slice(0, CELL_MAX_SIZE_BYTES));
      bufferToStore = bufferToStore.slice(CELL_MAX_SIZE_BYTES);
      if (bufferToStore.length > 0) {
        const newCell = new Cell();
        currentCell.refs.push(newCell);
        currentCell = newCell;
      }
    }

    dict.storeRef(sha256(k), rootCell);
  });

  return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict.endDict()).endCell();
}
export interface OracleMasterConfig {
  admin_address: Address;
  metadata: {
    name: string;
    image: string;
    description: string;
  };
  comission_size: BN;
  whitelisted_oracle_addresses: Address[];
  number_of_clients: BN,
  data_field: Cell,
}

const config: OracleMasterConfig = {
  admin_address: Address.parseFriendly('EQABXWX5UmONLte-JxYpEEiuUh-yXcgFucdJgpe2rN8Kb770').address, // just test wallet 
  metadata: {
    name: 'USDT/TON Price Oracle',
    image: 'https://www.linkpicture.com/q/download_183.png', // Image url
    description: 'This is master oracle for USDT/TON price',
  },
  comission_size: toNano(0.2),
  whitelisted_oracle_addresses: [],
  number_of_clients: new BN(0),
  data_field: beginCell().storeUint(0, 32).endCell(),
};
export function oracleMasterInitData(config: {
  admin_address: Address;
  metadata: {
    [s in any]?: string;
  };
  comission_size: BN;
  whitelisted_oracle_addresses: Address[];
  number_of_clients: BN;
  data_field: Cell;
}): Cell {
  return beginCell()
    .storeAddress(config.admin_address)
    .storeRef(buildOracleMetadataCell(config.metadata))
    .storeRef(oracleClientSourceV1CodeCell)
    .storeCoins(config.comission_size)
    .storeRef(beginCell().storeDict(buildAddressesDict(config.whitelisted_oracle_addresses)).endCell())
    .storeUint(config.number_of_clients, 32)
    .storeRef(config.data_field)
    .endCell();
}

const DeLabConnector = new DeLabConnect('https://google.com', 'Test', 'mainnet')
export const Client = new TonClient({ endpoint, apiKey });

export const Oracle: FC = () => {
  const user = useSelector((state: ReturnType<typeof store.getState>) => state.user.value)
  const wallet = useSelector((state: ReturnType<typeof store.getState>) => state.wallet.value)
  const dispatch = useDispatch()

  const { isConnected, address, network, typeConnect } = wallet
  const { id } = useParams();

  const [oracle, setOracle] = useState<IOracle | null>(null)
  const [userContractAddress, setUserContractAddress] = useState<string>('')
  const [valueBoc, setValueBoc] = useState<string>('')
  const [valueNumber, setValueNumber] = useState<string>('')


  const masterDeloy = async () => {
    //todo create body and deploy
    //todo get oracle address
    //send to api
    //
    if (oracle?.oracleAddress === 'none') {
      alert('deploy oracle wallet pls')
      return
    }
    config.admin_address = Address.parseFriendly(wallet.address ?? '').address
    const masterContractCode = oracleMasterSourceV1CodeCell
    config.whitelisted_oracle_addresses = [Address.parseFriendly(oracle?.oracleAddress ?? '').address]

    const masterContractInitDataCell = oracleMasterInitData(config);
    const masterContractAddress = contractAddress({
      workchain: 0,
      initialCode: masterContractCode,
      initialData: masterContractInitDataCell,
    });
    console.log(`master contract address: ${masterContractAddress.toFriendly()}`)
    // TODO send to delab to sign 
    const newCell = new Cell()

    const _stateInit = new StateInit({
      code: masterContractCode,
      data: masterContractInitDataCell,
    });
    const stateInit = new Cell();
    _stateInit.writeTo(stateInit);

    const toUrlSafe = (str: string) => str.replace(/\+/g, "-").replace(/\//g, "_");
    const isTonkeeper = typeConnect === "tonkeeper";
    const cellEncoded = stateInit.toBoc().toString('base64')

    console.log(123)
    console.log(masterContractAddress.toFriendly()
    )
    console.log(masterContractAddress.toFriendly({ urlSafe: isTonkeeper })
    )
    const trans: DeLabTransaction = {
      to: masterContractAddress.toFriendly({ urlSafe: isTonkeeper }),
      value: toNano(0.069).toString(),
      stateInit: isTonkeeper ? toUrlSafe(cellEncoded) : cellEncoded,
    }

    const res = await DeLabConnector.sendTransaction(trans)
    console.log(res)
    let found = false
    const pullInterval = 6000
    const pullCount = 10;

    if (res) {
      // if (isTonkeeper) {
      //   console.log('DONE? keeper');
      //   console.log(res);
      // }
      console.log("pending");
      try {

        let now = Date.now();
        for (let i = 0; i < pullCount; i++) {
          let txns = await Client.getTransactions(masterContractAddress, { limit: 1 });
          // console.log(txns)
          // let hasTx = txns.find((tx) => tx.inMessage?.value.eq(toNano(0.069)) && tx.time * 1000 > now);
          if (txns[0]) {
            found = true;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, pullInterval));
        }
        if (found) {
          console.log("success, sending request to update master add");
          fetch('http://localhost:5000/api/v1/uploadMasterAddress/', {
            method: 'POST',
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              'Authorization': `Bearer ${user.apiKey}`
            },
            body: JSON.stringify({
              oracleKey: id,
              masterAddress: masterContractAddress.toFriendly({ urlSafe: isTonkeeper })
            })
          }).then(e => e.json()).then((e: { status: string }) => {
            if (e.status === 'ok') {
              console.log(e)
              alert('done deploy master')
            } else {
              console.log(e)
            }
          })
        } else {
          console.log("error");
        }
      } catch (e) {
        console.log("error", e);
      }
    } else {
      console.log("error");
    }
    // const masterContractDeployTrx = () => deploySmartContract(owner.wallet, owner.keys, masterContractAddress, masterContractCode, masterContractInitDataCell);

    // await rpcClient.sendExternalMessage(owner.wallet, await masterContractDeployTrx()); // deploy master
    // await seqnoWaiter(rpcClient, owner.wallet)
  }

  const signup = async () => {
    if (oracle?.oracleAddress === 'none') {
      alert('deploy oracle wallet pls')
      return
    }
    if (oracle?.masterAddress === 'none') {
      alert('deploy master sc pls')
      return
    }
    if (!oracle) return
    console.log(userContractAddress)
    const signupBody = beginCell()
      .storeUint(OPS.Signup, 32) // opcode
      .storeUint(0, 64) // queryid
      .storeAddress(Address.parseFriendly(userContractAddress).address)
      .endCell()
    // const clietnWalletBalance = await rpcClient.getBalance(client.wallet.address)

    const toUrlSafe = (str: string) => str.replace(/\+/g, "-").replace(/\//g, "_");
    const isTonkeeper = typeConnect === "tonkeeper";
    const cellEncoded = signupBody.toBoc().toString('base64')

    console.log(123)
    // console.log(masterContractAddress.toFriendly()
    // )
    // console.log(masterContractAddress.toFriendly({ urlSafe: isTonkeeper })
    // )
    const value = 1.577

    const trans: DeLabTransaction = {
      to: Address.parseFriendly(oracle.masterAddress).address.toFriendly({ urlSafe: isTonkeeper }),
      value: toNano(value).toString(),
      payload: isTonkeeper ? toUrlSafe(cellEncoded) : cellEncoded,
    }

    const res = await DeLabConnector.sendTransaction(trans)
    console.log(res)

    let found = false
    const pullInterval = 6000
    const pullCount = 10;

    if (res) {
      // if (isTonkeeper) {
      //   console.log('DONE? keeper');
      //   console.log(res);
      // }
      console.log("pending");
      try {
        let clientSCaddress = null
        let now = Date.now();
        for (let i = 0; i < pullCount; i++) {
          let txns = await Client.getTransactions(Address.parseFriendly(oracle.masterAddress).address, { limit: 2 });
          console.log(txns)
          let hasTx = txns.find((tx) => tx.inMessage?.value.eq(toNano(value)));
          if (hasTx) {
            clientSCaddress = hasTx.outMessages[0].destination?.toFriendly()
            found = true;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, pullInterval));
        }
        if (found) {
          console.log("success, sending request to update master add");
          fetch('http://localhost:5000/api/v1/uploadClientAndUserAddresses/', {
            method: 'POST',
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              'Authorization': `Bearer ${user.apiKey}`
            },
            body: JSON.stringify({
              oracleKey: id,
              clientAddress: clientSCaddress,
              userAddress: userContractAddress
            })
          }).then(e => e.json()).then((e: { status: string }) => {
            if (e.status === 'ok') {
              console.log(e)
              alert('done signup')
            } else {
              console.log(e)
            }
          })
        } else {
          console.log("error");
        }
      } catch (e) {
        console.log("error", e);
      }
    } else {
      console.log("error");
    }
    return true
  }


  const fetchNewValue = async () => {

    if (oracle?.oracleAddress === 'none') {
      alert('deploy oracle wallet pls')
      return
    }
    if (oracle?.masterAddress === 'none') {
      alert('deploy master sc pls')
      return
    }
    if (oracle?.clientAddress === 'none') {
      alert('signup pls')
      return
    }
    if (!oracle) return
    console.log(userContractAddress)
    const signupBody = beginCell()
      .storeUint(OPS.Fetch, 32) // opcode
      .storeUint(0, 64) // queryid
      .storeAddress(Address.parseFriendly(oracle.clientAddress).address)
      .endCell()
    // const clietnWalletBalance = await rpcClient.getBalance(client.wallet.address)

    const toUrlSafe = (str: string) => str.replace(/\+/g, "-").replace(/\//g, "_");
    const isTonkeeper = typeConnect === "tonkeeper";
    const cellEncoded = signupBody.toBoc().toString('base64')

    console.log(123)
    // console.log(masterContractAddress.toFriendly()
    // )
    // console.log(masterContractAddress.toFriendly({ urlSafe: isTonkeeper })
    // )
    const value = 0.009

    const trans: DeLabTransaction = {
      to: Address.parseFriendly(oracle.userAddress ?? userContractAddress).address.toFriendly({ urlSafe: isTonkeeper }),
      value: toNano(value).toString(),
      payload: isTonkeeper ? toUrlSafe(cellEncoded) : cellEncoded,
    }

    const res = await DeLabConnector.sendTransaction(trans)
    console.log(res)

    let found = false
    const pullInterval = 6000
    const pullCount = 10;

    if (res) {
      // if (isTonkeeper) {
      //   console.log('DONE? keeper');
      //   console.log(res);
      // }
      console.log("pending");
      try {
        let clientSCaddress = null
        let now = Date.now();
        for (let i = 0; i < pullCount; i++) {
          let txns = await Client.getTransactions(Address.parseFriendly(oracle.userAddress ?? userContractAddress).address, { limit: 2 });
          console.log(txns)
          let hasTx = txns.find((tx) => tx.inMessage?.value.eq(toNano(value)));
          if (hasTx) {
            clientSCaddress = hasTx.outMessages[0].destination?.toFriendly()
            found = true;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, pullInterval));
        }
        if (found) {
          alert('done fetch');

          // fetch('http://localhost:5000/api/v1/uploadClientAndUserAddresses/', {
          //   method: 'POST',
          //   headers: {
          //     Accept: "application/json, text/plain, */*",
          //     "Content-Type": "application/json",
          //     'Authorization': `Bearer ${user.apiKey}`
          //   },
          //   body: JSON.stringify({
          //     oracleKey: id,
          //     clientAddress: clientSCaddress,
          //     userAddress: userContractAddress
          //   })
          // }).then(e => e.json()).then((e: { status: string }) => {
          //   if (e.status === 'ok') {
          //     console.log(e)
          //   } else {
          //     console.log(e)
          //   }
          // })
        } else {
          console.log("error");
        }
      } catch (e) {
        console.log("error", e);
      }
    } else {
      console.log("error");
    }
    return true
  }

  const getNewValue = () => (async () => {
    if (!oracle) { return }
    const newValueBoc = await Client.callGetMethod(Address.parseFriendly(oracle.userAddress ?? userContractAddress).address, 'get_data_field') // works only for this case
    const newValue = await Client.callGetMethod(Address.parseFriendly(oracle.userAddress ?? userContractAddress).address, 'get_data_field_value') // works only for this case
    console.log(newValueBoc)
    console.log(newValue)
    setValueBoc(newValueBoc.stack[0][1].bytes)
    setValueNumber((parseInt(newValue.stack[0][1]) / 100)+'')
  })()

  useEffect(() => {
    setOracle(user.oracles.filter((e: IOracle) => e.oracleKey === id)[0] as IOracle)
    getNewValue()
  }, [user])

  const makeCopy = (text: string) => <span className={'makeCopy'} onClick={() => navigator.clipboard.writeText(text)}>{text}</span>

  return (
    <div style={{
      background: 'black',
      color: '#fff',
      backgroundRepeat: 'no-repeat',
      backgroundSize: `cover`
    }}>
      <Link to='/' style={{
        padding: '20px',
        marginTop: '20px',
        color: 'white', margin: '-20px auto 20px auto'
      }}>&lt; go to main page</Link>
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
            <h1>Oracle {makeCopy(id + '')}</h1>
            {(user && oracle) ? <>
              <h3>Your oracle info block</h3>
              <p>
                Your raven apiKey: <span className={'makeCopy'} onClick={() => navigator.clipboard.writeText(user.apiKey)}>{`${user.apiKey.slice(0, 5)}...${user.apiKey.slice(-5)}`}</span>
              </p>
              <p>oracleAddress: {makeCopy(oracle.oracleAddress)}</p>
              <p>masterAddress: {makeCopy(oracle.masterAddress)}</p>
              <p>clientAddress: {makeCopy(oracle.clientAddress)}</p>
              <p>userAddress: {makeCopy(oracle.userAddress)}</p>
              <button onClick={masterDeloy}>deploy master contract</button>
              <br />
              <br />
              <button onClick={() => setUserContractAddress('EQCY1gG9Xv9jMZrDF799SgWMe7B8g9LX2vHUeOu1ncEUeU7O')}>use our default user sc</button>
              <br />
              <br />
              or you can insert you own address:
              <br />
              <input value={userContractAddress} onChange={(e) => setUserContractAddress(e.target.value)} />
              <br />
              <br />
              <button onClick={signup}>signup</button>
              <br />
              <br />
              fetch new value from client sc via user sc
              <br />
              <button onClick={fetchNewValue}>fetch</button>
              <br />
              <br />
              get new value
              <br />
              <button onClick={getNewValue}>get
              </button>
              <br />
              <br />
              ur value boc: {valueBoc}
              <br />
              ur value number: {valueNumber}
            </> : 'some error with acc login'}
          </div>
            : null}
        </div >
      </div >
    </div >
  )
}
