import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import { Input } from "@material-ui/core";
import "./DepositAndWithdraw.css";


export default function DepositAndWithdraw() {
  return (
  
    <Grid container>
      <Grid item xs={7}></Grid>
      <Grid item xs={5}>
        <Input className="field" id="value" placeholder="Add / Remove Margin" variant="outlined" />
        <Button variant="outlined" className="deposit" onClick={()=> {alert('Deposit')}}>Deposit</Button>
        <Button variant="outlined" className="withdraw" onClick={()=> {alert('Withdraw')}}>Withdraw</Button>
      </Grid>
    </Grid>
  );
}
