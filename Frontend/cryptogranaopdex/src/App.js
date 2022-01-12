import { Route, Switch } from "react-router-dom";

import MainNavigation from "./components/MainNavegations";
import Trade from "./pages/Trade";
import Orderbook from "./pages/Orderbook";
import MyPositions from "./pages/MyPositions";
import MainPage from "./pages/MainPage";

import { ethers } from "ethers";
import Web3Modal from "web3modal";

function App() {
  // let contractAddress = "";
  // let SimpleStorage_abi = [{}];

  //Using to connect
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          return result[0];
          
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      console.log("Please install MetaMask browser extension to interact");
    }
  };

      return (
      <div>
        <MainNavigation connector={connectWalletHandler} />
        <Switch>
          <Route path="/" exact>
            <MainPage />
          </Route>
          <Route path="/trade">
            <Trade />
          </Route>
          <Route path="/orderbook">
            <Orderbook />
          </Route>
          <Route path="/myPositions">
            <MyPositions />
          </Route>
        </Switch>
      </div>
    );
  };

export default App;
