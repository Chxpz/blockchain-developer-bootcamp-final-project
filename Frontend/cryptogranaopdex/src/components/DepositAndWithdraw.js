import Grid from "@material-ui/core/Grid";
import classes from "./DepositAndWithdraw.module.css";
import Button from "@material-ui/core/Button";
import { Input } from "@material-ui/core";

export default function DepositAndWithdraw() {
  return (
  
    <Grid container>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}>
        <Input inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} className={classes.field} id="value" placeholder="Add / Remove Margin" variant="outlined" />
        <Button variant="outlined" className={classes.deposit} onClick={()=> {alert('Deposit')}}>Deposit</Button>
        <Button variant="outlined" className={classes.withdraw} onClick={()=> {alert('Withdraw')}}>Withdraw</Button>
      </Grid>
    </Grid>
   
    


  );
}
