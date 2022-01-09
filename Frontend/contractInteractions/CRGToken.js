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

//Mint tokens
async function mint(to, amount) {
  await contractCrg.functions
    .mint(to, amount)
    .then((res) => {
      obj = {
        result: res,
        Msg: `${amount} CRG tokens minted to ${to}`,
        errorMsg: "",
      };
      console.log(obj);
      return obj;
    })

    .catch((err) => {
      let error = JSON.parse(err.error.body);
      obj = {
        result: "",
        Msg: "",
        errorMsg: error.error.message,
      };
      console.log(obj);
      return obj;
    });
}

//mint("0x469d407de283c356ab6e5d2c6d93e8a102ae3150", 90000000000);

async function toBalanceOf(addr) {
    await contractCrg.functions
      .balanceOf(addr)
      .then((res) => {
        obj = {
          resultBalance: parseFloat(res.toString()),
          Msg: `${amount} CRG tokens minted to ${to}`,
          errorMsg: "",
        };
        console.log(obj);
        return obj;
      })
      .catch((err) => {
        let error = JSON.parse(err.error.body);
        obj = {
          result: "",
          Msg: "",
          errorMsg: error.error.message,
        };
        console.log(obj);
        return obj;
      });
  }
  
  //toBalanceOf("0x469d407de283c356ab6e5d2c6d93e8a102ae3150")

  async function toApprove(spender, amount) {
    await contractCrg.functions
      .approve(spender,amount)
      .then((res) => {
        obj = {
          result: res,
          Msg: 'Ok',
          errorMsg: "",
        };
        console.log(obj);
        return obj;
      })
      .catch((err) => {
        let error = JSON.parse(err.error.body);
        obj = {
          result: "",
          Msg: "",
          errorMsg: error.error.message,
        };
        console.log(obj);
        return obj;
      });
  }

  //toApprove("0xC4ef889D713d38bb1C60D1Cbe0c1441051dF8E26",90000000000)