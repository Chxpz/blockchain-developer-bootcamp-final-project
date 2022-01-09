require("dotenv").config();

const { ethers } = require("ethers");

const _abiCrg = require("../../build/contracts/CryptogranaToken.json");
const abiCrg = _abiCrg.abi;

const addrCrg = "0x24fb218Cb19Bc059Ee473A528E7ae900EF48bEAB";

const RPC = "http://127.0.0.1:9545/" || "https://api.s0.b.hmny.io";

const provider = new ethers.providers.JsonRpcProvider(RPC);
const sign = process.env.pvtKey;
const wallet = new ethers.Wallet(sign);
const signer = wallet.connect(provider);

const contractCrg = new ethers.Contract(addrCrg, abiCrg, signer);
console.log(contractCrg);

