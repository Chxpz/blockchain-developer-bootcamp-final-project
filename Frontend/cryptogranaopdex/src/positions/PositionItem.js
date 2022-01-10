import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles({
  root: {
    width: '30vh',
    margin: "0% 0% 0% 0%",
    padding: "5% 5% 5% 5%",
    background: "linear-gradient(135deg, #2989d8 9%,#11396d 28%)",
    border: "1px solid rgb(75,0,130)",
    borderRadius: "20px 20px 20px 20px",
    boxShadow: "7px 7px 7px 2px rgb(40,20,40)",
    boxSizing: "border-box",
    color: "white",
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
