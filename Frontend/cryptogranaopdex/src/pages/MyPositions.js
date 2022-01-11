import { makeStyles } from "@material-ui/core/styles";
import DepositAndWithdraw from "../components/DepositAndWithdraw";

import ListPositions from '../positions/PositionsList'

const Dummy_Data = [{
  id:'1',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
,
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
},
{
  id:'2',
  title:'One',
  position:'call',
  spot:'2',
  time:'10'
}

]

const useStyles = makeStyles({
  root: {
    
    width: '90%',
    
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    
    
}
});

function MyPositions() {
  const classes = useStyles();
  return (
    
    // <Orderbook />,
    <div className={classes.root}>
    <DepositAndWithdraw />
    <ListPositions positions = {Dummy_Data} 
    />
    </div>
      );
}

export default MyPositions;