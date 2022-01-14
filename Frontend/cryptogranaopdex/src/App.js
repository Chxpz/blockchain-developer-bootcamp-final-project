import { Route, Switch } from "react-router-dom";

import MainNavigation from "./components/MainNavegations";
import Trade from "./pages/Trade";
import Orderbook from "./pages/Orderbook";
import MyPositions from "./pages/MyPositions";
import MainPage from "./pages/MainPage";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

function getLibrary(provider) {
  return new ethers(provider);
}

function App() {
  return (
    <div>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MainNavigation />
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
      </Web3ReactProvider>
    </div>
  );
}

export default App;
