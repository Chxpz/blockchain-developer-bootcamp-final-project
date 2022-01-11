import React from "react";
import heropage from "../images/imageMainpage.png"
import classes from './mainPage.module.css'

function MainPage() {
  return (
   <div className={classes.div1}>
       <p>teste</p>
       <div className={classes.div2}>
           <h1>Hedge your $one portfolio</h1>
           <h3>For $one holders</h3>
           <p>If you hold some $one tokens, create put or call options
           receives rewards by staking them on the platform and a premium
           paid by the buyer of your option
           You need to deposit some $one in advance as a margin to create a position
           </p>
           <h3>Buy and sell options</h3>
           <p>If you want to buy a put or call, pay the premium
           on the option due date if you want to call your position
           simply deposit the diference betwen the premium paid and the spot price
           for this operation uses CRG Token, our native token
           </p>
       </div>
       <div className={classes.div3}>
            <img className={classes.img} src = {heropage} />
       </div>
   </div> 
  )
}

export default MainPage;