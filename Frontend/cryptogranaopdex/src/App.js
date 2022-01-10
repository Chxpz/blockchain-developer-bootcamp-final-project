import { Route, Switch } from "react-router-dom";

import MainNavigation from "./components/MainNavegations";
import Trade from "./pages/Trade";
import Orderbook from "./pages/Orderbook";
import MyPositions from "./pages/MyPositions";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
