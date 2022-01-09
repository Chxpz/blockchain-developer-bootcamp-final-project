require('dotenv').config()

const {ethers} = require('ethers');

const _abiOpDex = require('../../build/contracts/OptionDex.json')
const abiOpDex = _abiOpDex.abi

const addrOpDex = '0x0Fa2511f09F0A43dc84C61B0bf48ccA6FEa190Ad'

const RPC = ('http://127.0.0.1:9545/' || 'https://api.s0.b.hmny.io')

const provider = new ethers.providers.JsonRpcProvider(RPC);
const sign = process.env.pvtKey
const wallet = new ethers.Wallet(sign)
const signer = wallet.connect(provider)

const ContractOpDex = new ethers.Contract(addrOpDex, abiOpDex, signer)

console.log(ContractOpDex)