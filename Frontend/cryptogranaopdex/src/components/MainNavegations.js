
import React, {useState} from 'react'

import { injected } from './wallet/connectors'

import { Link } from "react-router-dom";
import classes from "./MainNavegations.module.css";
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core';

function MainNavigation() {

  const {active, account, library, connector, activate, deactivate} = useWeb3React()
  
  async function connect() {
    try{
      await activate(injected);
    }catch(e){
      console.log(e)
    }
  }

  
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
            <button onClick={connect}>
              
            </button>
            
          </li>
          <li>
            <span className={classes.spanmargin}>Address: {account}</span>
            <span className={classes.spanmargin}>User margin:  </span>
            <span className={classes.spanmargin}>10,000</span>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
