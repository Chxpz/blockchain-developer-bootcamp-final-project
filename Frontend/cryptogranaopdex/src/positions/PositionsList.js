import PositionItem from './PositionItem'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
   list:{
     
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
   }
  });

function PositionsList(props){
    const classes = useStyles();
    return (
        <div className={classes.list}>
        
        {
            props.positions.map((a)=>(
                <PositionItem
                key = {a.id}
                id = {a.id}
                title = {a.title}
                position = {a.position}
                spot = {a.spot}
                time = {a.time}
                />
                ))
        }
        </div>
        
    )
}

export default PositionsList;