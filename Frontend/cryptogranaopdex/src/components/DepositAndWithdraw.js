import {useState} from 'react';

// import {injected} from './wallet/connectors'

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Input } from "@material-ui/core";
import { ethers } from 'ethers';
import "./DepositAndWithdraw.css";

export default function DepositAndWithdraw() {
//   // deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
//  let contractAddress = '';
//  let contractOpDex = require ('.../../../build/contracts/OptionDex.json')
 
//  const [userMargin, setUserMargin] = useState(null);
//  const [errorMessage, setErrorMessage] = useState(null);
//  const [defaultAccount, setDefaultAccount] = useState(null);
//  const [connButtonText, setConnButtonText] = useState('Connect Wallet');

//  const [currentContractVal, setCurrentContractVal] = useState(null);

//  const [provider, setProvider] = useState(null);
//  const [signer, setSigner] = useState(null);
//  const [contract, setContract] = useState(null);

//  const connectWalletHandler = () => {
//    if (window.ethereum && window.ethereum.isMetaMask) {

//      window.ethereum.request({ method: 'eth_requestAccounts'})
//      .then(result => {
//        accountChangedHandler(result[0]);
//        setConnButtonText('Wallet Connected');
//      })
//      .catch(error => {
//        setErrorMessage(error.message);
     
//      });

//    } else {
//      console.log('Need to install MetaMask');
//      setErrorMessage('Please install MetaMask browser extension to interact');
//    }
//  }

//  // update account, will cause component re-render
//  const accountChangedHandler = (newAccount) => {
//    setDefaultAccount(newAccount);
//    updateEthers();
//  }

//  const chainChangedHandler = () => {
//    // reload the page to avoid any errors with chain change mid use of application
//    window.location.reload();
//  }


//  // listen for account changes
//  window.ethereum.on('accountsChanged', accountChangedHandler);

//  window.ethereum.on('chainChanged', chainChangedHandler);

//  const updateEthers = () => {
//    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
//    setProvider(tempProvider);

//    let tempSigner = tempProvider.getSigner();
//    setSigner(tempSigner);

//    let tempContract = new ethers.Contract(contractAddress, SimpleStorage_abi, tempSigner);
//    setContract(tempContract);	
//  }

//  const setHandler = (event) => {
//    event.preventDefault();
//    console.log('sending ' + event.target.setText.value + ' to the contract');
//    contract.set(event.target.setText.value);
//  }

//  const getCurrentVal = async () => {
//    let val = await contract.get();
//    setCurrentContractVal(val);
//  }
  
  // const setHandler = (event) =>{
  //   event.preventDefault();
  //   console.log('sending', '--->>>> ' + event.target.setText.value +  '<<<----' , 'depositado')
  //   // contract.set(event.target.setText.value);
  // }
  
   
  
  
  return (
  
    <Grid container>
      <Grid item xs={2}>
      </Grid>
      <Grid item xs={5}>
      {/* <form onSubmit={setHandler}> */}
      <Input className="field" id="setText" placeholder="Add/Withdraw Margin Call" variant="outlined" />
        <Button variant="outlined" className="deposit" type={"submit"} >Deposit</Button>
        <Button variant="outlined" className="withdraw" type={"submit"}>Withdraw</Button>
        {/* </form> */}
      </Grid>
      <Grid item xs={5}>
        <Input className="field" id="value" placeholder="Add/Withdraw Margin Put" variant="outlined" />
        <Button variant="outlined" className="deposit" onClick={()=> {alert('Deposit')}}>Deposit</Button>
        <Button variant="outlined" className="withdraw" onClick={()=> {alert('Withdraw')}}>Withdraw</Button>
      </Grid>
    </Grid>
  );
}
