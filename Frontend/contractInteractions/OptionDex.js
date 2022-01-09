require("dotenv").config();

const { ethers } = require("ethers");

const _abiOpDex = require("../../build/contracts/OptionDex.json");
const abiOpDex = _abiOpDex.abi;

const addrOpDex = "0xC4ef889D713d38bb1C60D1Cbe0c1441051dF8E26";

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
      obj = {
          result : res,
          Msg: `Deposited ${amount}`,
          errorMsg:''
      }
    })
    .catch((err) => {
        let error = JSON.parse(err.error.body)
        obj = {
            result : '',
            Msg: '',
            errorMsg: error.error.message
        }
      return obj;
      
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
      return(res);
    })
    .catch((err) => {
        let error = JSON.parse(err.error.body)
        obj = {
            errorMsg: error.error.message
        }
      return obj;
      
    });
}

//toInitializePosition(1,2,1,1,1,1)

async function toUserMargin(addr){
    await contractOpDex.functions.userMargin(addr)
        .then((res) => {
            let result = parseFloat(res.toString())/100000000
            obj = {
                UserMargin = `User margin balance is ${result} `
            }
            return obj;
        })
        .catch((err) => {
            let error = JSON.parse(err.error.body)
            obj = {
                errorMsg: error.error.message
            }
          return obj;
          
        });
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