require("dotenv").config();

const { ethers } = require("ethers");

const _abiOpDex = require("../../build/contracts/OptionDex.json");
const abiOpDex = _abiOpDex.abi;

const addrOpDex = "0x0Fa2511f09F0A43dc84C61B0bf48ccA6FEa190Ad";

const RPC = "http://127.0.0.1:9545/" || "https://api.s0.b.hmny.io";

const provider = new ethers.providers.JsonRpcProvider(RPC);
const sign = process.env.pvtKey;
const wallet = new ethers.Wallet(sign);
const signer = wallet.connect(provider);

const contractOpDex = new ethers.Contract(addrOpDex, abiOpDex, signer);

async function toDeposit(amount) {
  await contractOpDex.functions
    .deposit({ value: ethers.utils.parseEther(amount) })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err);
    });
}

//toDeposit("1");

async function toInitializePosition(
  _id,
  _amount,
  _sidePosition,
  _premium,
  _spotFuture,
  _expirationDate
) {
  await contractOpDex.functions
    .initializePosition(
      _id,
      _amount,
      _sidePosition,
      _premium,
      _spotFuture,
      _expirationDate
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

//toInitializePosition(1,1,1,1,1,1)

async function toUserMargin(addr){
    await contractOpDex.functions.userMargin(addr)
        .then((res) => {
            let result = parseFloat(res.toString())/100000000
            console.log(result)
        }).catch((err) => {
            console.log(err)
        })
}

//toUserMargin('0xe9e701039a9e296315ca114fe18a7fb2987e6933')

async function toSetAcceptedToken(token) {
    await contractOpDex.functions.setAcceptedToken(token)
    .then(() => {
        obj = {
            Msg: 'Accepted token set',
            errorMsg:''
        }
        console.log(obj)
    }).catch((err) => {
        obj = {
            Msg:'',
            errorMsg:err.reason
        }
        console.log(obj)
    })
}

//toSetAcceptedToken()

async function toEnterPosition(id, premiumToPay){
    await contractOpDex.functions.EnterPosition(id, premiumToPay)
    .then(() =>{
        obj = {
            Msg:`Success in entering the position for the operation ID ${id}`,
            errorMsg:''
        }
    }).catch((err) => {
        obj = {
            Msg:'',
            errorMsg: reason.err
        }
    })
}

//toEnterPosition()

async function toCalculateRemainingAmount(id){
    await contractOpDex.functions.calculateRemainingAmount(id)
        .then((res) =>{
            obj = {
                Msg: `The remaining amount is ${res}`,
                errorMsg: ''
            }
        }).catch((err) => {
            obj = {
                Msg:'',
                errorMsg: err.reason
            }
        })
}

//toCalculateRemainingAmount(id)

async function toSettlement(id){
    await contractOpDex.functions.Settlement(id)
        .then(() =>{
            obj = {
                Msg:'Contract Settled',
                errorMsg: ''
            }
        }).catch((err) => {
            obj = {
                Msg:'',
                errorMsg: err.reason
            }
        })
}

//toSettlement(id)