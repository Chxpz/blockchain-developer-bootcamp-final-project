import React, { useState } from "react";
import { ethers } from "ethers";

import { Link } from "react-router-dom";
import classes from "./MainNavegations.module.css";

function MainNavigation() {
  let contractAddress = "";
  let SimpleStorage_abi = [{}];

  //Using to connect
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      SimpleStorage_abi,
      tempSigner
    );
    setContract(tempContract);
  };

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [currentContractVal, setCurrentContractVal] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

   return (
    <header className={classes.header}>
      <nav>
        <ul>
          <li className={classes.li}>
            <Link to="/"> Home</Link>
          </li>
          <li className={classes.li}>
            <Link to="/Trade"> Trade</Link>
          </li>
          <li>
            <Link to="/Orderbook"> Orderbook</Link>
          </li>
          <li>
            <Link to="/Mypositions">My Positions</Link>
          </li>
          <li>
          <button className={classes.button} onClick={connectWalletHandler}>{connButtonText}</button>
          <span className={classes.span}>{defaultAccount}</span>
            
            
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
