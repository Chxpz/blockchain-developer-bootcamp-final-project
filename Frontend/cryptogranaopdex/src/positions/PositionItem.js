import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles({
  root: {
    width: '30vh',
    margin: "0% 0% 0% 0%",
    padding: "5% 5% 5% 5%",
    background: 'linear-gradient(90deg, rgba(19,10,20,1) 1%, rgba(19,10,20,1) 18%, rgba(19,10,20,1) 38%, rgba(24,4,22,1) 54%, rgba(19,11,20,1) 74%, rgba(38,19,48,1) 94%)',
    border: "1px solid rgb(75,0,130)",
    borderRadius: "20px 20px 20px 20px",
    boxShadow: "0px 0px 15px 5px rgb(128, 91, 128)",
    boxSizing: "border-box",
    color: "white",
    '&:hover':{
      boxShadow: '0 1px rgb(15, 15, 15)',
      transform: 'translateY(3px)'
    }
  },

  cardContent:{
    padding: "10% 10% 10% 10%",
  },

  div: {
    margin: "3% 3% 3% 3%",
    padding: "0% 0% 0%",
    width: '30vh',
      

    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  titulo: {
    color: "white",
    
  },
});

export default function PositionItem(props) {
  const classes = useStyles();
  return (
    <div className={classes.div}>
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.titulo}
            gutterBottom
            variant="h5"
            component="h2"
          >
            <p>{props.title}</p>
          </Typography>
          <Typography variant="body2" component="p">
            <p>{props.id}</p>
            <p>{props.position}</p>
            <p>{props.spot}</p>
            <p>{props.time}</p>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
