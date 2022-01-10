import React from "react";
import heropage from "../images/imageMainpage.png"
import classes from './mainPage.module.css'

function MainPage() {
  return (
   <div className={classes.div1}>
       <p>teste</p>
       <div className={classes.div2}>
           <p>Teste</p>
       </div>
       <div className={classes.div3}>
            <img className={classes.img} src = {heropage} />
       </div>
   </div> 
  )
}

export default MainPage;